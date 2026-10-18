import { routeAction } from '@/lib/route-action';

const ProfileController = {
    destroy: routeAction('profile.destroy', 'delete'),
};

export default ProfileController;
