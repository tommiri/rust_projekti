import AuthProvider from '@/providers/authProvider';
import Routes from '@/routes/Routes';

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
