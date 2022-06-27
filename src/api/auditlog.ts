import API from './configAPI';
import { AppSettings } from './api.setting';

export default {
    getAuditLog() {
        return API.get(AppSettings.API_AUDIT_LOG);
    }
};
