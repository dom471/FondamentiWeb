import "./Recipes.css";

const recipes = [
  {
    name: "Il Piccante",
    ingredients: "Pane, scamorza, salame piccante, melanzane grigliate, olio extravergine d'oliva, olio al peperoncino",
    description: 'Per preparare Il Piccante si parte da un pane rustico, leggermente scaldato su piastra o in forno, in modo da renderlo croccante fuori e morbido all’interno. Sulla base ancora calda si adagiano alcune fette di scamorza, lasciandole fondere lentamente grazie al calore del pane. A questo punto si aggiunge il salame piccante, seguito dalle melanzane grigliate, che bilanciano la sapidità con una nota più morbida e aromatica. Il panino viene poi completato con un filo di olio extravergine d’oliva e qualche goccia di olio al peperoncino, regolando l’intensità secondo il gusto. Una volta chiuso e leggermente pressato, Il Piccante è pronto per essere servito caldo, con un sapore deciso e avvolgente.',
  },

  {
    name: "Il Tradizionale",
    ingredients: "Pane, porchetta, patate al forno, provola",
    description: "Il Tradizionale nasce da poche cose fatte bene. Si prende un pane rustico e lo si scalda quel tanto che basta per renderlo croccante fuori e morbido dentro. Dentro va subito la porchetta calda, tagliata abbondante, perché qui non si lesina. Arrivano poi le patate al forno, morbide e saporite, che rendono ogni morso pieno e soddisfacente. A chiudere il tutto c’è la provola, che con il calore si scioglie e lega ogni ingrediente. Il panino si chiude, si pressa leggermente e si serve caldo, pronto da mangiare con le mani e senza pensarci troppo."
  },

  {
    name: "Pulled Passion",
    ingredients: "Pane, hamburger, cheddar, pulled pork, bacon",
    description: "Pulled Passion è un panino senza mezze misure. Si parte da un pane ben scaldato, pronto a reggere il peso delle cose serie. Alla base va l’hamburger, cotto alla perfezione e ancora succoso, subito coperto dal cheddar che si scioglie lentamente con il calore della carne. Sopra arriva il pulled pork, morbido e sfilacciato, ricco di sapore e carico di carattere. A chiudere il gioco c’è il bacon croccante, che aggiunge la spinta finale a ogni morso. Il panino si chiude, si pressa quanto basta e si serve caldo: sporca le mani, riempie la pancia e non chiede spiegazioni."
  },

  {
    name: "Cheeseburger",
    ingredients: "Pane, hamburger, cheddar, insalata, pomodoro, cetrioli, ketchup",
    description: "Il Cheeseburger è un classico che non ha bisogno di presentazioni. Si parte da un pane morbido, leggermente tostato per dargli la giusta tenuta. Dentro va l’hamburger, cotto alla piastra e ancora succoso, subito coperto dal cheddar che si scioglie e avvolge la carne. A seguire arrivano l’insalata croccante e il pomodoro fresco, per dare equilibrio e freschezza. I cetriolini aggiungono la nota acida che fa la differenza, mentre il ketchup chiude il panino con quel sapore inconfondibile che mette tutti d’accordo. Si chiude, si schiaccia appena e si serve caldo: semplice, diretto, sempre giusto."
  },
];

function Recipes() {
  return (
    <div className="recipes-page">
      <h1>Le nostre ricette</h1>
      <p>Consulta le ricette dei nostri prodotti artigianali.</p>

      <div className="recipes-grid">
        {recipes.map((r) => (
          <div className="recipe-card" key={r.name}>
            <h2>{r.name}</h2>
            <h4>Ingredienti:</h4>
            <p>{r.ingredients}</p>
            <h4>Preparazione:</h4>
            <p>{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recipes;