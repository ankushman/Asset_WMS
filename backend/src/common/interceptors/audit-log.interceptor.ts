import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLogRecord, AuditLogRecordDocument } from '../../schemas/audit-log.schema';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);

  constructor(
    @InjectModel(AuditLogRecord.name) private auditLogModel: Model<AuditLogRecordDocument>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, params, user, headers } = req;

    // Only audit mutating state requests (POST, PUT, PATCH, DELETE)
    if (['GET', 'OPTIONS', 'HEAD'].includes(method.toUpperCase())) {
      return next.handle();
    }

    const ipAddress = req.ip || headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
    const userAgent = headers['user-agent'] || 'Unknown Agent';

    const pathSegments = url.split('?')[0].split('/').filter(Boolean);
    const moduleName = pathSegments[1] || pathSegments[0] || 'GENERAL';
    const actionName = `${method.toUpperCase()} /${pathSegments.join('/')}`;

    return next.handle().pipe(
      tap(async (responseData) => {
        try {
          const userId = user?.id || user?.sub || body?.userId || 'SYSTEM';
          const userName = user?.name || user?.email || body?.userName || body?.email || 'Anonymous';
          const companyId = user?.companyId || body?.companyId || 'comp-001';
          const entityId = params?.id || responseData?.id || responseData?._id?.toString() || 'N/A';

          const sanitizedBody = this.sanitizeBody(body);
          const sanitizedResponse = this.sanitizeBody(responseData);

          await this.auditLogModel.create({
            userId,
            userName,
            companyId,
            action: actionName,
            module: moduleName.toUpperCase(),
            entityId,
            details: `Action ${method.toUpperCase()} performed on module ${moduleName.toUpperCase()}`,
            oldValues: null,
            newValues: sanitizedBody,
            ipAddress: String(ipAddress),
            userAgent: String(userAgent),
          });
        } catch (err) {
          this.logger.warn(`[AuditLogInterceptor Warning] Failed to write audit log: ${err.message}`);
        }
      }),
    );
  }

  private sanitizeBody(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    try {
      const cloned = JSON.parse(JSON.stringify(obj));
      const sensitiveKeys = ['password', 'passwordHash', 'token', 'jwt', 'secret'];
      const sanitizeObj = (target: any) => {
        if (!target || typeof target !== 'object') return;
        for (const k of Object.keys(target)) {
          if (sensitiveKeys.some((s) => k.toLowerCase().includes(s))) {
            target[k] = '[REDACTED]';
          } else if (typeof target[k] === 'object') {
            sanitizeObj(target[k]);
          }
        }
      };
      sanitizeObj(cloned);
      return cloned;
    } catch (e) {
      return {};
    }
  }
}
