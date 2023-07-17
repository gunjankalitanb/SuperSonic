import React from "react";
import { FaFacebook, FaTwitter, FaPinterest } from "react-icons/fa";
import { Link } from "react-router-dom";
import aboutH from "./images/ab_head.jpg";
import about1 from "./images/ab_1.jpg";
import about2 from "./images/ab_2.jpg";
import about3 from "./images/ab_3.jpg";
import about4 from "./images/ab_4.png";
import about5 from "./images/ab_5.png";
import about6 from "./images/ab_6.png";
import about7 from "./images/ab_7.png";
import aboutf from "./images/ab-foot.png";

function AboutUs() {
  return (
    <div>
      <div className="navbar-c">
        <div className="navbar-container-c">
          <div className="navbar-logo-c">
            <Link to="/">
              <div className="header-envato_market-c">SuperSonic</div>
            </Link>
          </div>
        </div>
      </div>
      <div className="ab-head">
        <img src={aboutH} alt="#" />
      </div>
      <div className="cn-ab">
        <div className="abmy-cart-container">
          <h1>
            <Link to="/">Home</Link>/About
          </h1>

          <div className="abB1">
            <div className="ab1c"></div>
            <div className="abB1i">
              <img src={about1} alt="#" />
            </div>
            <div className="ab1whole">
              <div className="pseudo-a1"> </div>
              <div className="twrap_ab1">Play Your Mood</div>
              <div className="abtag1">
                <p>
                  Discover the perfect soundtrack for every moment <br />
                  and play your mood with our premium headphones.
                </p>
              </div>
            </div>
          </div>

          <div className="abB2">
            <div className="abB2i">
              <img src={about2} alt="#" />
            </div>
            <div className="ab2whole">
              <div className="pseudo-a2"></div>
              <div className="twrap_ab2">Connect With World</div>
              <div className="abtag2">
                <p>
                  Immerse yourself and connect with the world <br />
                  through our premium headphones.
                </p>
              </div>
            </div>

            <div className="abB3">
              <div className="abB3i">
                <img src={about3} alt="#" />
              </div>
              <div className="ab3whole">
                <div className="pseudo-a3"></div>
                <div className="twrap_ab3">Feel The Rythm</div>
                <div className="abtag3">
                  <p>
                    Experience music like never before and let the <br />
                    rhythm move you with our premium headphones
                  </p>
                </div>
              </div>
            </div>

            <div className="container_about">
              <div className="pseudo-a4"></div>
              <div className="twrap_ab4">Move With Beat</div>

              <div className="grid-container">
                <div className="cont-1a">
                  <div className="abB4i">
                    <img src={about4} alt="#" />
                  </div>
                  <div className="twrap_ab5">Wireless Headset</div>
                  <div className="abtag5">
                    <p>
                      Experience seamless audio freedom with our wireless
                      headsets for immersive and tangle-free listening.
                      <br />
                    </p>
                  </div>
                </div>
                <div className="cont-2a">
                  <div className="abB5i">
                    <img src={about5} alt="#" />
                  </div>

                  <div className="twrap_ab6">Noiseless Headphones</div>
                  <div className="abtag6">
                    <p>
                      Experience pure audio bliss with our noiseless headphones,
                      offering uninterrupted and crystal-clear sound quality.
                    </p>
                  </div>
                </div>
                <div className="cont-3a">
                  <div className="abB6i">
                    <img src={about6} alt="#" />
                  </div>

                  <div className="twrap_ab7">Open Back Headset</div>
                  <div className="abtag7">
                    <p>
                      Experience immersive audio with an open-back design that
                      offers spacious soundstage and natural sound reproductions
                    </p>
                  </div>
                </div>
                <div className="cont-4a">
                  <div className="abB7i">
                    <img src={about7} alt="#" />
                  </div>

                  <div className="twrap_ab8">Gaming Headset</div>
                  <div className="abtag8">
                    <p>
                      Enhance your gaming experience with our high-performance
                      gaming headset.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="ab-foot">
              <div className="pseudo-af1"></div>
              <div className="pseudo-af2"></div>
              <div className="abfi">
                <img src={aboutf} alt="#" />
              </div>
              <div className="abfw">
                <div className="abftag">
                  <p>Follow us on</p>
                </div>
                <div className="abfooter-social">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon facebook"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon twitter"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon pinterest"
                  >
                    <FaPinterest />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
