import '../App.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
        <p>© {currentYear} <a href="https://pixelsummit.dev/">PixelSummit</a> | All Rights Reserved</p>
    </footer>
  );
};

export default Footer;