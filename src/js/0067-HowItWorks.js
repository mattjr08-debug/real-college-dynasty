// "How this works" boxes for the draft and transfer portal pop-ups (item 36). Closed by default so the pop-ups stay short.
var HOW_IT_WORKS = {
  draft: [
    "Each spring, your underclassmen that pro teams would pick are listed here as declared. Seniors graduate and are not part of this.",
    "You get one try to talk each one into coming back. The chance is on the button. Extra NIL raises it, and the money is only spent if he stays.",
    "A player “testing the waters” is not a projected pick. He works out for pro teams and hears feedback, and most come back even if you choose “Let him decide”.",
    "A player who leaves is drafted or turns pro, and moves to your former players. Rating, potential, age, injuries and tournament wins all move his draft position.",
    "A returning player needs an open roster spot (15 is the limit).",
  ],
  portal: [
    "Players who are unhappy (little playing time, a broken promise, a bigger offer elsewhere) may enter the portal. The reason is shown on each row.",
    "You get one conversation with each. Promising a role and offering extra NIL both raise the chance he stays. The money is only spent if he stays.",
    "“Let him go” puts him in the portal. You can still bring him back with an offer, and about 1 in 20 entrants who get no offer they like change their mind and stay. If one of yours does, you choose: Accept takes him back at his NIL, Deny sends him to another school.",
    "After you take a new job, some of your old players may ask to follow you here.",
    "About 5 players per school enter each year. You see the best 170 under Recruiting > Transfer portal, and you recruit them like any other player; they can play right away.",
    "Schools bid for each entrant within their own budgets and he leans to the best fit, so a strong rival bid lowers your chance. You get 3 campus visits in the window (a visit raises his interest). Graduate transfers have one year left and ask for less.",
    "To open a spot you can release a player into the portal (player profile, “Release into portal”). The first release is free; each one after that costs reputation and team morale.",
    "The portal is a short window of 3 waves before the high school rounds. The best entrants are decided first, so make offers early. Unsigned entrants are gone when it closes. The high school class is locked (no offers, scouting or official visits) until the window closes.",
  ],
};
function HowItWorks({ kind }) {
  return (0, s.jsxs)("details", {
    className: "how-it-works",
    children: [
      (0, s.jsx)("summary", { children: kind === "draft" ? "How the draft works" : "How the transfer portal works" }),
      (0, s.jsx)("ul", { children: HOW_IT_WORKS[kind].map((t, i) => (0, s.jsx)("li", { children: t }, i)) }),
    ],
  });
}
