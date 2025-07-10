import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const features = [
  {
    icon: "fa-solid fa-list-ul",
    title: "Choose Your Workout List",
    description: "Pick from default or public lists to start training.",
  },
  {
    icon: "fa-solid fa-dice",
    title: "Fun Random Modes",
    description:
      "Use randomizer, dice, cards, or roulette to make workouts exciting.",
  },
  {
    icon: "fa-solid fa-coins",
    title: "Earn Coins",
    description: "Complete exercises and earn coins based on effort.",
  },
  {
    icon: "fa-solid fa-dumbbell",
    title: "Create Custom Lists",
    description:
      "Unlock the ability to create your own workout lists with 100 coins.",
  },
  {
    icon: "fa-solid fa-music",
    title: "Workout With Music",
    description: "Listen to music or unlock custom tracks with 200 coins.",
  },
  {
    icon: "fa-solid fa-trophy",
    title: "Compete on the Leaderboard",
    description: "Climb the ranks and challenge others globally.",
  },
];

const LandingPage = () => {
  return (
    <div className="coin-container-cong full-screen">
      <div className="landing-page">
        <section className="hero">
          <h1>
            <span className="highlight">Sportvana</span> is Your Chance to Level
            Up Your Fitness with Fun & Rewards
          </h1>
          <p>
            Complete exercises, earn coins, unlock features, and challenge the
            leaderboard — your ultimate fitness gamification journey begins
            here.
          </p>
          <div className="btn-group">
            <Link to="/login" state={{ isRegisterL: true }} className="btn">
              Get Started
            </Link>
            <Link to="/login" className="btn outline">
              Log In
            </Link>
          </div>
        </section>
        <section className="features" aria-labelledby="features-heading">
          <h2 id="features-heading" className="visually-hidden">
            Features
          </h2>
          <ul className="feature-list">
            {features.map((feature, idx) => (
              <li className="feature-card" key={idx}>
                <i className={feature.icon}></i>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="cta">
          <h2>Ready to Join the Fitness Revolution?</h2>
          <p>
            It's free to start — complete your first workout and earn your first
            coins in minutes.
          </p>
          <div className="btn-group">
            <Link to="/login" state={{ isRegisterL: true }} className="btn">
              Sign Up Now
            </Link>
            <Link to="/login" className="btn outline">
              Log In
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
