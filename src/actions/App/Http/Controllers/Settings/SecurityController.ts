import { routeAction } from '@/lib/route-action';

const SecurityController = {
    update: routeAction('security.update', 'put'),
};

export default SecurityController;
