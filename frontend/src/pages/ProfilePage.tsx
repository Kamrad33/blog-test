import { Container } from '@mui/material';
import ProfileInfo from '../components/ProfileInfo';
import PostList from '../components/PostList';

const ProfilePage = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <ProfileInfo />
            <PostList />
        </Container>
    );
};

export default ProfilePage;


