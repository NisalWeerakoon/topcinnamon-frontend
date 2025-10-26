import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>About CinnamonMiracle</h1>
        <p className="about-subtitle">Crafting Excellence in Every Spice</p>
      </div>

      <div className="about-content">
        <section className="about-story">
          <div className="story-grid">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                Founded with a passion for authentic Ceylon cinnamon, CinnamonMiracle has been 
                dedicated to bringing the finest quality spices to discerning customers worldwide. 
                Our journey began with a simple belief: that the best cinnamon should be accessible 
                to everyone who appreciates true quality.
              </p>
              <p>
                We source our cinnamon directly from the finest plantations in Sri Lanka, ensuring 
                that every quill, every grain of powder, and every drop of oil meets our exacting 
                standards of purity and excellence.
              </p>
            </div>
            <div className="story-image">
              <div className="image-placeholder">
                <p>Cinnamon Plantation</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-values">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Quality First</h3>
              <p>We never compromise on quality. Every product undergoes rigorous testing to ensure it meets our high standards.</p>
            </div>
            <div className="value-card">
              <h3>Sustainability</h3>
              <p>We work directly with local farmers, promoting sustainable farming practices and fair trade.</p>
            </div>
            <div className="value-card">
              <h3>Authenticity</h3>
              <p>Our cinnamon is 100% authentic Ceylon cinnamon, sourced directly from Sri Lankan plantations.</p>
            </div>
          </div>
        </section>

        <section className="about-mission">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              To provide the world's finest Ceylon cinnamon while supporting local communities 
              and promoting sustainable agriculture. We believe that exceptional spices should 
              enhance every culinary experience, from the simplest home-cooked meal to the most 
              sophisticated gourmet creation.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
