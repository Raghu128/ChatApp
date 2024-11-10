import { React, useEffect } from "react";
import "./HomePage.css";
import ScrollReveal from "scrollreveal";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

  useEffect(() => {
    const scrollRevealOption = {
      distance: "50px",
      origin: "bottom",
      duration: 1000,
    };

    ScrollReveal().reveal(".header__container h1", scrollRevealOption);

    ScrollReveal().reveal(".header__container h4", {
      ...scrollRevealOption,
      delay: 500,
    });

    ScrollReveal().reveal(".header__container .btn", {
      ...scrollRevealOption,
      delay: 1000,
    });

    // about container
    ScrollReveal().reveal(
      ".about__container .section__header",
      scrollRevealOption
    );
    ScrollReveal().reveal(".about__container .section__subheader", {
      ...scrollRevealOption,
      delay: 500,
    });

    ScrollReveal().reveal(".about__container .about__flex", {
      ...scrollRevealOption,
      delay: 1000,
    });

    ScrollReveal().reveal(".about__container .btn", {
      ...scrollRevealOption,
      delay: 1500,
    });

    // discover container
    ScrollReveal().reveal(".discover__card", {
      ...scrollRevealOption,
      interval: 500,
    });

    ScrollReveal().reveal(".discover__card__content", {
      ...scrollRevealOption,
      interval: 500,
      delay: 200,
    });

    // blogs container
    ScrollReveal().reveal(".blogs__card", {
      duration: 1000,
      interval: 400,
    });

    // journals container
    ScrollReveal().reveal(".journals__card", {
      ...scrollRevealOption,
      interval: 400,
    });
  }, []);

  return (
    <div>
      <header id="home">
        <nav>
          <div className="nav__bar">
            <div className="nav__logo" >
              <a href="/">Traviya.</a>
            </div>
            <ul className="nav__links">
              <li className="link">
                <a href="#home">Home</a>
              </li>
              <li className="link">
                <a href="#about">About Us</a>
              </li>
              <li className="link"  >
                <a href="/home">Discover</a>
              </li>
              <li className="link">
                <a href="#blog">Blog</a>
              </li>
              <li className="link">
                <a href="#journals">Journals</a>
              </li>
              <li className="link">
                <a href="#gallery">Gallery</a>
              </li>
              <li className="link">
                <a href="#contact">Contact</a>
              </li>
              <li className="link search">
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </li>
            </ul>
          </div>
        </nav>
        <div className="section__container header__container">
          <h1>Connect and Plan Your Next Vacation Together</h1>
          <h4>Join a community of explorers and discover new destinations</h4>
          <button className="btn" onClick={()=> navigate("/home")}>
            Explore More <i className="ri-arrow-right-line"></i>
          </button>
        </div>
      </header>

      <section className="about" id="about">
        <div className="section__container about__container">
          <div className="about__content">
            <h2 className="section__header">About us</h2>
            <p className="section__subheader">
              Our mission is to foster a vibrant community of explorers, where
              every traveler can connect, share, and collaborate on
              unforgettable vacation plans. We provide a platform that allows
              users to join dynamic group chats filled with like-minded
              adventurers, helping them discover exciting destinations and
              create personalized itineraries. With the support of our
              enthusiastic community, users can embark on journeys filled with
              shared experiences, uncover hidden gems, and make lifelong
              memories. Join us as we transform the way people plan their
              travels and celebrate the joy of discovery together!
            </p>
            <div className="about__flex">
              <div className="about__card">
                <h4>268</h4>
                <p>Completed Trips</p>
              </div>
              <div className="about__card">
                <h4>153</h4>
                <p>Destinations</p>
              </div>
            </div>
            <button className="btn">
              Read More <i className="ri-arrow-right-line"></i>
            </button>
          </div>
          <div className="about__image">
            <img src="assets/about.jpg" alt="about" />
          </div>
        </div>
      </section>

      <section className="discover" id="discover">
        <div className="section__container discover__container">
          <h2 className="section__header">Discover the most engaging places</h2>
          <p className="section__subheader">
            Let's see the world with us with you and your family.
          </p>
          <div className="discover__grid">
            <div className="discover__card">
              <div className="discover__image">
                <img src="assets/discover-1.jpg" alt="discover" />
              </div>
              <div className="discover__card__content">
                <h4>Norway</h4>
                <p>
                  Discover the untamed beauty of Norway, a land where rugged
                  mountains, and enchanting northern lights paint a surreal
                  backdrop.
                </p>
                <button className="discover__btn"  onClick={() => navigate("/home")}>
                  Discover More <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>
            <div className="discover__card">
              <div className="discover__image">
                <img src="assets/discover-2.jpg" alt="discover" />
              </div>
              <div className="discover__card__content">
                <h4>London</h4>
                <p>
                  From urban rock climbing to twilight cycling through royal
                  parks, London beckons adventure enthusiasts to embrace
                  opportunities.
                </p>
                <button className="discover__btn" onClick={() => navigate("/home")}>
                  Discover More <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>
            <div className="discover__card">
              <div className="discover__image">
                <img src="assets/discover-3.jpg" alt="discover" />
              </div>
              <div className="discover__card__content">
                <h4>Japan</h4>
                <p>
                  From scaling the iconic peaks of Mount Fuji to immersing in
                  the serenity, Japan offers adventurers a captivating cultural
                  treasures.
                </p>
                <button className="discover__btn" onClick={() => navigate("/home")}>
                  Discover More <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blogs" id="blog">
        <div className="blogs__container">
          <h2 className="section__header">Latest on the blogs</h2>
          <p className="section__subheader">
            We want to help youto travel better!
          </p>
          <div className="blogs__grid">
            <div className="blogs__card">
              <img src="assets/blog-1.jpg" alt="blog" />
              <div className="blogs__content">
                10 mistakes every first time traveller will make and how to
                avoid them!
              </div>
            </div>
            <div className="blogs__card">
              <img src="assets/blog-2.jpg" alt="blog" />
              <div className="blogs__content">
                What's it really like to move to a country where you don't speak
                the language?
              </div>
            </div>
            <div className="blogs__card">
              <img src="assets/blog-3.jpg" alt="blog" />
              <div className="blogs__content">
                Exploring the quite corners of Oslo | Gallop around the globe.
              </div>
            </div>
            <div className="blogs__card">
              <img src="assets/blog-4.jpg" alt="blog" />
              <div className="blogs__content">
                11 things to know before you visit rainbow mountain in Peru.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="journals" id="journals">
        <div className="section__container journals__container">
          <h2 className="section__header">The travel journals</h2>
          <p className="section__subheader">
            A journal is a place to record new things you have discovered while
            exploring various places you visit.
          </p>
          <div className="journals__grid">
            <div className="journals__card">
              <img src="assets/journals-1.jpg" alt="journal" />
              <div className="journals__content">
                <div className="journals__author">
                  <img src="assets/author-1.jpg" alt="author" />
                  <p>By Marry Ann</p>
                </div>
                <h4>How to use less plastic when you travel.</h4>
                <div className="journals__footer">
                  <p>18 Apr 2022</p>
                  <span>
                    <a href="#">
                      <i className="ri-share-fill"></i>
                    </a>
                  </span>
                </div>
              </div>
            </div>
            <div className="journals__card">
              <img src="assets/journals-2.jpg" alt="journal" />
              <div className="journals__content">
                <div className="journals__author">
                  <img src="assets/author-2.jpg" alt="author" />
                  <p>By Austin Martin</p>
                </div>
                <h4>The best weekend road trips from Denver.</h4>
                <div className="journals__footer">
                  <p>22 Jun 2022</p>
                  <span>
                    <a href="#">
                      <i className="ri-share-fill"></i>
                    </a>
                  </span>
                </div>
              </div>
            </div>
            <div className="journals__card">
              <img src="assets/journals-3.jpg" alt="journal" />
              <div className="journals__content">
                <div className="journals__author">
                  <img src="assets/author-3.jpg" alt="author" />
                  <p>By Anina Joseph</p>
                </div>
                <h4>Tips and tricks to plan your next adventure.</h4>
                <div className="journals__footer">
                  <p>05 Sep 2022</p>
                  <span>
                    <a href="#">
                      <i className="ri-share-fill"></i>
                    </a>
                  </span>
                </div>
              </div>
            </div>
            <div className="journals__card">
              <img src="assets/journals-4.jpg" alt="journal" />
              <div className="journals__content">
                <div className="journals__author">
                  <img src="assets/author-4.jpg" alt="author" />
                  <p>By Jacob Fernandez</p>
                </div>
                <h4>A beginner's guide to hostel's.</h4>
                <div className="journals__footer">
                  <p>14 Dec 2022</p>
                  <span>
                    <a href="#">
                      <i className="ri-share-fill"></i>
                    </a>
                  </span>
                </div>
              </div>
            </div>
            <div className="journals__card">
              <img src="assets/journals-5.jpg" alt="journal" />
              <div className="journals__content">
                <div className="journals__author">
                  <img src="assets/author-5.jpg" alt="author" />
                  <p>By John Smith</p>
                </div>
                <h4>17 unconventional travel hacks you need.</h4>
                <div className="journals__footer">
                  <p>10 Feb 2022</p>
                  <span>
                    <a href="#">
                      <i className="ri-share-fill"></i>
                    </a>
                  </span>
                </div>
              </div>
            </div>
            <div className="journals__card">
              <img src="assets/journals-6.jpg" alt="journal" />
              <div className="journals__content">
                <div className="journals__author">
                  <img src="assets/author-6.jpg" alt="author" />
                  <p>By Aaran Kennedy</p>
                </div>
                <h4>Travel tip's you'll wish you'd known sooner.</h4>
                <div className="journals__footer">
                  <p>20 Mar 2023</p>
                  <span>
                    <a href="#">
                      <i className="ri-share-fill"></i>
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="journals__btn">
            <button className="btn">
              View All Journals <i className="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>
      </section>

      <section className="hero">
        <div className="section__container hero__container">
          <p>Traviya.</p>
        </div>
      </section>

      <section className="gallery" id="gallery">
        <div className="gallery__container">
          <h2 className="section__header">Gallery photos</h2>
          <p className="section__subheader">
            Explore the most beautiful places in the world.
          </p>
          <div className="gallery__grid">
            <div className="gallery__card">
              <img src="assets/gallery-1.jpg" alt="gallery" />
              <div className="gallery__content">
                <h4>Northern Lights</h4>
                <p>Norway</p>
              </div>
            </div>
            <div className="gallery__card">
              <img src="assets/gallery-2.jpg" alt="gallery" />
              <div className="gallery__content">
                <h4>Krabi</h4>
                <p>Thailand</p>
              </div>
            </div>
            <div className="gallery__card">
              <img src="assets/gallery-3.jpg" alt="gallery" />
              <div className="gallery__content">
                <h4>Bali</h4>
                <p>Indonesia</p>
              </div>
            </div>
            <div className="gallery__card">
              <img src="assets/gallery-4.jpg" alt="gallery" />
              <div className="gallery__content">
                <h4>Tokyo</h4>
                <p>Japan</p>
              </div>
            </div>
            <div className="gallery__card">
              <img src="assets/gallery-5.jpg" alt="gallery" />
              <div className="gallery__content">
                <h4>Taj Mahal</h4>
                <p>India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="section__container contact__container">
          <div className="contact__col">
            <h4>Contact a travel researcher</h4>
            <p>We always aim to reply within 24 hours.</p>
          </div>
          <div className="contact__col">
            <div className="contact__card">
              <span>
                <i className="ri-phone-line"></i>
              </span>
              <h4>Call us</h4>
              <h5>+91 9123455670</h5>
              <p>We are online now</p>
            </div>
          </div>
          <div className="contact__col">
            <div className="contact__card">
              <span>
                <i className="ri-mail-line"></i>
              </span>
              <h4>Send us an enquiry</h4>
            </div>
          </div>
        </div>
      </section>

      <section className="footer">
        <div className="section__container footer__container">
          <h4>Traviya.</h4>
          <div className="footer__socials">
            <span>
              <a href="#">
                <i className="ri-facebook-fill"></i>
              </a>
            </span>
            <span>
              <a href="#">
                <i className="ri-instagram-fill"></i>
              </a>
            </span>
            <span>
              <a href="#">
                <i className="ri-twitter-fill"></i>
              </a>
            </span>
            <span>
              <a href="#">
                <i className="ri-linkedin-fill"></i>
              </a>
            </span>
          </div>
          <p>Join with someone who belong to you</p>
          <ul className="footer__nav">
            <li className="footer__link">
              <a href="#home">Home</a>
            </li>
            <li className="footer__link">
              <a href="#about">About</a>
            </li>
            <li className="footer__link">
              <a href="#discover">Discover</a>
            </li>
            <li className="footer__link">
              <a href="#blog">Blog</a>
            </li>
            <li className="footer__link">
              <a href="#journals">Journals</a>
            </li>
            <li className="footer__link">
              <a href="#gallery">Gallery</a>
            </li>
            <li className="footer__link">
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
        <div className="footer__bar">
          Copyright © 2023 Web Design Mastery. All rights reserved.
        </div>
      </section>
    </div>
  );

  //   return (
  //     <div>
  //       <header id="home">
  //         <nav>
  //           <div className="nav__bar">
  //             <div className="nav__logo"><a href="#">Traviya.</a></div>
  //             <ul className="nav__links">
  //               <li className="link"><a href="#home">Home</a></li>
  //               <li className="link"><a href="#about">About Us</a></li>
  //               <li className="link"><a href="#discover">Discover</a></li>
  //               <li className="link"><a href="#blog">Blog</a></li>
  //               <li className="link"><a href="#journals">Journals</a></li>
  //               <li className="link"><a href="#gallery">Gallery</a></li>
  //               <li className="link"><a href="#contact">Contact</a></li>
  //               <li className="link search">
  //                 <span><i className="ri-search-line"></i></span>
  //               </li>
  //             </ul>
  //           </div>
  //         </nav>
  //         <div className="section__container header__container">
  //           <h1>The new way to plan your next adventure</h1>
  //           <h4>Explore the colourful world</h4>
  //           <button className="btn">
  //             Explore More <i className="ri-arrow-right-line"></i>
  //           </button>
  //         </div>
  //       </header>

  //       {/* About Section */}
  //       <section className="about" id="about">
  //         <div className="section__container about__container">
  //           <div className="about__content">
  //             <h2 className="section__header">About us</h2>
  //             <p className="section__subheader">
  //               Our mission is to ignite the spirit of discovery in every traveler's heart, offering meticulously crafted itineraries that blend adrenaline-pumping activities with awe-inspiring landscapes. With a team of seasoned globetrotters, we ensure that every expedition is infused with excitement, grace our planet. Embark on a voyage of a lifetime with us, as we redefine the art of exploration.
  //             </p>
  //             <div className="about__flex">
  //               <div className="about__card"><h4>268</h4><p>Completed Trips</p></div>
  //               <div className="about__card"><h4>176</h4><p>Tour Guides</p></div>
  //               <div className="about__card"><h4>153</h4><p>Destinations</p></div>
  //             </div>
  //             <button className="btn">
  //               Read More <i className="ri-arrow-right-line"></i>
  //             </button>
  //           </div>
  //           <div className="about__image">
  //             <img src="assets/about.jpg" alt="about" />
  //           </div>
  //         </div>
  //       </section>

  //       {/* Discover Section */}
  //       <section className="discover" id="discover">
  //         <div className="section__container discover__container">
  //           <h2 className="section__header">Discover the most engaging places</h2>
  //           <p className="section__subheader">
  //             Let's see the world with us with you and your family.
  //           </p>
  //           <div className="discover__grid">
  //             {/* Card 1 */}
  //             <div className="discover__card">
  //               <div className="discover__image">
  //                 <img src="assets/discover-1.jpg" alt="discover" />
  //               </div>
  //               <div className="discover__card__content">
  //                 <h4>Norway</h4>
  //                 <p>Discover the untamed beauty of Norway, a land where rugged mountains, and enchanting northern lights paint a surreal backdrop.</p>
  //                 <button className="discover__btn">
  //                   Discover More <i className="ri-arrow-right-line"></i>
  //                 </button>
  //               </div>
  //             </div>
  //             {/* Card 2 */}
  //             <div className="discover__card">
  //               <div className="discover__image">
  //                 <img src="assets/discover-2.jpg" alt="discover" />
  //               </div>
  //               <div className="discover__card__content">
  //                 <h4>London</h4>
  //                 <p>From urban rock climbing to twilight cycling through royal parks, London beckons adventure enthusiasts to embrace opportunities.</p>
  //                 <button className="discover__btn">
  //                   Discover More <i className="ri-arrow-right-line"></i>
  //                 </button>
  //               </div>
  //             </div>
  //             {/* Card 3 */}
  //             <div className="discover__card">
  //               <div className="discover__image">
  //                 <img src="assets/discover-3.jpg" alt="discover" />
  //               </div>
  //               <div className="discover__card__content">
  //                 <h4>Japan</h4>
  //                 <p>From scaling the iconic peaks of Mount Fuji to immersing in the serenity, Japan offers adventurers captivating cultural treasures.</p>
  //                 <button className="discover__btn">
  //                   Discover More <i className="ri-arrow-right-line"></i>
  //                 </button>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </section>

  //       {/* Blogs Section */}
  //       <section className="blogs" id="blog">
  //         <div className="blogs__container">
  //           <h2 className="section__header">Latest on the blogs</h2>
  //           <p className="section__subheader">We want to help you to travel better!</p>
  //           <div className="blogs__grid">
  //             {/* Blog Card 1 */}
  //             <div className="blogs__card">
  //               <img src="assets/blog-1.jpg" alt="blog" />
  //               <div className="blogs__content">10 mistakes every first time traveller will make and how to avoid them!</div>
  //             </div>
  //             {/* Blog Card 2 */}
  //             <div className="blogs__card">
  //               <img src="assets/blog-2.jpg" alt="blog" />
  //               <div className="blogs__content">What's it really like to move to a country where you don't speak the language?</div>
  //             </div>
  //             {/* Blog Card 3 */}
  //             <div className="blogs__card">
  //               <img src="assets/blog-3.jpg" alt="blog" />
  //               <div className="blogs__content">Exploring the quiet corners of Oslo | Gallop around the globe.</div>
  //             </div>
  //             {/* Blog Card 4 */}
  //             <div className="blogs__card">
  //               <img src="assets/blog-4.jpg" alt="blog" />
  //               <div className="blogs__content">11 things to know before you visit rainbow mountain in Peru.</div>
  //             </div>
  //           </div>
  //         </div>
  //       </section>

  //       {/* Journals Section */}
  //       <section className="journals" id="journals">
  //         <div className="section__container journals__container">
  //           <h2 className="section__header">The travel journals</h2>
  //           <p className="section__subheader">A journal is a place to record new things you have discovered while exploring various places you visit.</p>
  //           <div className="journals__grid">
  //             {/* Journal Card 1 */}
  //             <div className="journals__card">
  //               <img src="assets/journals-1.jpg" alt="journal" />
  //               <div className="journals__content">
  //                 <div className="journals__author">
  //                   <img src="assets/author-1.jpg" alt="author" />
  //                   <p>By Marry Ann</p>
  //                 </div>
  //                 <h4>How to use less plastic when you travel.</h4>
  //                 <div className="journals__footer">
  //                   <p>18 Apr 2022</p>
  //                   <span><a href="#"><i className="ri-share-fill"></i></a></span>
  //                 </div>
  //               </div>
  //             </div>
  //             {/* Journal Card 2 */}
  //             <div className="journals__card">
  //               <img src="assets/journals-2.jpg" alt="journal" />
  //               <div className="journals__content">
  //                 <div className="journals__author">
  //                   <img src="assets/author-2.jpg" alt="author" />
  //                   <p>By Austin Martin</p>
  //                 </div>
  //                 <h4>The best weekend road trips from Denver.</h4>
  //                 <div className="journals__footer">
  //                   <p>22 Jun 2022</p>
  //                   <span><a href="#"><i className="ri-share-fill"></i></a></span>
  //                 </div>
  //               </div>
  //             </div>
  //             {/* Journal Card 3 */}
  //             <div className="journals__card">
  //               <img src="assets/journals-3.jpg" alt="journal" />
  //               <div className="journals__content">
  //                 <div className="journals__author">
  //                   <img src="assets/author-3.jpg" alt="author" />
  //                   <p>By John Doe</p>
  //                 </div>
  //                 <h4>Tips to travel when you are on a budget.</h4>
  //                 <div className="journals__footer">
  //                   <p>05 Mar 2022</p>
  //                   <span><a href="#"><i className="ri-share-fill"></i></a></span>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </section>

  //       {/* Gallery Section */}
  //       <section className="gallery" id="gallery">
  //       <div className="gallery__container">
  //         <h2 className="section__header">Gallery photos</h2>
  //         <p className="section__subheader">
  //           Explore the most beautiful places in the world.
  //         </p>
  //         <div className="gallery__grid">
  //           <div className="gallery__card">
  //             <img src="assets/gallery-1.jpg" alt="gallery" />
  //             <div className="gallery__content">
  //               <h4>Northern Lights</h4>
  //               <p>Norway</p>
  //             </div>
  //           </div>
  //           <div className="gallery__card">
  //             <img src="assets/gallery-2.jpg" alt="gallery" />
  //             <div className="gallery__content">
  //               <h4>Krabi</h4>
  //               <p>Thailand</p>
  //             </div>
  //           </div>
  //           <div className="gallery__card">
  //             <img src="assets/gallery-3.jpg" alt="gallery" />
  //             <div className="gallery__content">
  //               <h4>Bali</h4>
  //               <p>Indonesia</p>
  //             </div>
  //           </div>
  //           <div className="gallery__card">
  //             <img src="assets/gallery-4.jpg" alt="gallery" />
  //             <div className="gallery__content">
  //               <h4>Tokyo</h4>
  //               <p>Japan</p>
  //             </div>
  //           </div>
  //           <div className="gallery__card">
  //             <img src="assets/gallery-5.jpg" alt="gallery" />
  //             <div className="gallery__content">
  //               <h4>Taj Mahal</h4>
  //               <p>India</p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </section>

  //       {/* Contact Section */}
  //       <section className="contact" id="contact">
  //       <div className="section__container contact__container">
  //         <div className="contact__col">
  //           <h4>Contact a travel researcher</h4>
  //           <p>We always aim to reply within 24 hours.</p>
  //         </div>
  //         <div className="contact__col">
  //           <div className="contact__card">
  //             <span><i className="ri-phone-line"></i></span>
  //             <h4>Call us</h4>
  //             <h5>+91 9876543210</h5>
  //             <p>We are online now</p>
  //           </div>
  //         </div>
  //         <div className="contact__col">
  //           <div className="contact__card">
  //             <span><i className="ri-mail-line"></i></span>
  //             <h4>Send us an enquiry</h4>
  //           </div>
  //         </div>
  //       </div>
  //     </section>

  //       {/* Footer */}
  //       <section className="footer">
  //       <div className="section__container footer__container">
  //         <h4>Traviya.</h4>
  //         <div className="footer__socials">
  //           <span>
  //             <a href="#"><i className="ri-facebook-fill"></i></a>
  //           </span>
  //           <span>
  //             <a href="#"><i className="ri-instagram-fill"></i></a>
  //           </span>
  //           <span>
  //             <a href="#"><i className="ri-twitter-fill"></i></a>
  //           </span>
  //           <span>
  //             <a href="#"><i className="ri-linkedin-fill"></i></a>
  //           </span>
  //         </div>
  //         <p>
  //           Cheap Romantic Vacations. Many people feel that there is a limited
  //           amount of abundance, wealth, or chance to succeed in life.
  //         </p>
  //         <ul className="footer__nav">
  //           <li className="footer__link"><a href="#home">Home</a></li>
  //           <li className="footer__link"><a href="#about">About</a></li>
  //           <li className="footer__link"><a href="#discover">Discover</a></li>
  //           <li className="footer__link"><a href="#blog">Blog</a></li>
  //           <li className="footer__link"><a href="#journals">Journals</a></li>
  //           <li className="footer__link"><a href="#gallery">Gallery</a></li>
  //           <li className="footer__link"><a href="#contact">Contact</a></li>
  //         </ul>
  //       </div>
  //       <div className="footer__bar">
  //         Copyright © 2023 Web Design Mastery. All rights reserved.
  //       </div>
  //     </section>
  //     </div>
  //   );
};

export default HomePage;
