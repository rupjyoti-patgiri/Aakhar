const Footer = () => {
    return (
      <footer className="border-t">
        <div className="container py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BlogVerse. All Rights Reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;