import { Toaster } from 'react-hot-toast';
import AppRoute from './app/router';

function App() {
  return (
    <>    
    <AppRoute />
    <Toaster position="top-right"/>
    </>

  );
}

export default App;