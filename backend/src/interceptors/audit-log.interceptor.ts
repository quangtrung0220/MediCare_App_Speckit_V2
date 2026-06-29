import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../services/audit.service';
import { AuditAction } from '../models/audit-log.entity';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, ip, headers } = request;
    const userAgent = headers['user-agent'] || null;

    // Detect mutative action type
    let action: AuditAction | null = null;
    if (method === 'POST') action = 'CREATE';
    else if (method === 'PUT' || method === 'PATCH') action = 'UPDATE';
    else if (method === 'DELETE') action = 'DELETE';

    // Only audit mutative write operations
    if (!action) {
      return next.handle();
    }

    // Determine entity name based on route prefix
    let entity = 'System';
    if (url.includes('/patients')) entity = 'Patient';
    else if (url.includes('/appointments')) entity = 'Appointment';
    else if (url.includes('/billing') || url.includes('/payments')) entity = 'Payment';
    else if (url.includes('/clinical') || url.includes('/medical-records')) entity = 'MedicalRecord';
    else if (url.includes('/prescriptions')) entity = 'Prescription';
    else if (url.includes('/inventory')) entity = 'InventoryItem';

    return next.handle().pipe(
      tap({
        next: (data) => {
          // Log on success
          const entityId = data?.id || body?.id || null;
          this.auditService.createLog({
            action,
            entity,
            entityId,
            changes: JSON.stringify({
              url,
              method,
              body: method !== 'DELETE' ? body : undefined,
            }),
            ipAddress: ip || '127.0.0.1',
            userAgent,
          }).catch((err) => {
            console.error('AuditLogInterceptor failed to save log:', err);
          });
        },
      }),
    );
  }
}
