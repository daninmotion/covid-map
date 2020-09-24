import { ThemeProvider } from 'theme-ui';
import 'leaflet/dist/leaflet.css';

//Realative path imports
import '../base.css';
import theme from '../theme';

function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default App;