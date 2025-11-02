import "./Recipes.css";

const recipes = [
  {
    name: "Pane Casereccio",
    ingredients: "Farina 00, acqua, lievito madre, sale",
    description:
      "Pane tradizionale a lunga lievitazione, crosta croccante e mollica morbida, cotto nel forno a pietra.",
  },
  {
    name: "Pizza Margherita",
    ingredients: "Farina, acqua, lievito, sale, passata di pomodoro, mozzarella, basilico",
    description:
      "Base soffice e fragrante, condita con pomodoro fresco e mozzarella filante. Cotta nel forno del panificio.",
  },
  {
    name: "Pane Integrale",
    ingredients: "Farina integrale, acqua, lievito madre, sale, olio extravergine d'oliva",
    description:
      "Pane ricco di fibre e dal sapore intenso, ideale per una dieta equilibrata.",
  },
  {
    name: "Cornetto alla Crema",
    ingredients: "Farina, burro, zucchero, uova, latte, crema pasticcera",
    description:
      "Cornetto fragrante e dorato, farcito con la nostra crema artigianale fatta in laboratorio.",
  },
    {
  name: "Focaccia",
  ingredients: "Farina 00, acqua, lievito di birra, olio extravergine d’oliva, sale, rosmarino",
  description:
    "Focaccia morbida e fragrante, condita con olio e rosmarino, cotta al forno per ottenere una doratura perfetta.",
  },
  {
    name: "Crocchetta",
    ingredients: "Patate, uova, formaggio grattugiato, prezzemolo, pangrattato, sale, pepe",
    description:
      "Crocchette dorate e croccanti fuori, dal cuore morbido di patate e formaggio, fritte alla perfezione.",
  },
  {
    name: "Rustici",
    ingredients: "Pasta sfoglia, wurstel, formaggio filante, uovo per spennellare",
    description:
      "Rustico di pasta sfoglia ripieno di wurstel e formaggio filante, dorato e fragrante, ideale come snack salato.",
  },
  {
    name: "Pasticciotto",
    ingredients: "Farina 00, zucchero, burro, uova, crema pasticcera, scorza di limone",
    description:
      "Dolce tipico leccese con frolla dorata e friabile, ripieno di cremosa crema pasticcera profumata al limone.",
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
