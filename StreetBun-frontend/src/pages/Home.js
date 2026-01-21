// Homepage di StreetBun
import { Grid, Card, CardMedia, CardContent, Typography, Container, Box } from "@mui/material";
import cheeseburger from "../immaginiHome/cheeseburger.jpeg";
import hotdog from "../immaginiHome/Hotdog.jpeg";
import tradizionale from "../immaginiHome/iltradizionale.jpeg";
import pulled from "../immaginiHome/Pullpassion.jpeg";
import piccante from "../immaginiHome/piccante.jpeg";

const products = [
  {
    name: "Cheeseburger",
    image: cheeseburger,
  },
  {
    name: "Hotdog",
    image: hotdog,
  },
  {
    name: "Il Tradizionale",
    image: tradizionale,
  },
  {
    name: "Pulled Passion",
    image: pulled,
  },
  {
    name: "Il Piccante",
    image: piccante,
  },
];

// Componente Home
function Home() {
  //Stile dei titoli (gialli) delle sezioni
  const sectionHeadingSx = {
    fontWeight: "bold",
    color: "#D9AD58",
    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
  };
  //Stile del testo delle sezioni
  const bodyTextSx = {
    color: 'white',
    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
    fontSize: "1.1rem",
    maxWidth: "100%",
    mx: 0, //margin orizzontale
    px: 0, //padding orizzontale
    textAlign: "center",
  };

  return (
    <Container sx={{ position: "relative", py: 5 }}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)",
          zIndex: 0,
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1 }}>

        {/* Sezione 1: Titolo e concept */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#AA3A2C', textShadow: '3px 3px 6px rgba(0,0,0,0.8)' }}>
            StreetBun - Panini street food
          </Typography>
          <Typography variant="h5" align="center" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }} paragraph>
            Scopri il gusto autentico dei panini artigianali preparati con ingredienti freschi e locali, perfetti per una pausa veloce e deliziosa in movimento.
          </Typography>
        </Box>

        {/* Sezione 2: Dove e quando trovarci */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" align="center" gutterBottom sx={sectionHeadingSx}>
            Dove e quando trovarci
          </Typography>
          <Typography variant="body1" sx={bodyTextSx} paragraph>
            Siamo situati difronte all'ingresso del Campus Universitario in via Edoardo Orabona 4.
          </Typography>
          <Typography variant="body1" sx={bodyTextSx} paragraph>
            Orari di apertura: Lunedì-Venerdì 8:00-20:00, Sabato 8:00-14:00, Domenica chiuso.
          </Typography>
        </Box>

        {/* Sezione 3: Best sellers */}
        <Typography variant="h4" align="center" sx={{ ...sectionHeadingSx, mb: 5 }}>
          I nostri best seller
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {products.map((item) => (
            <Grid item key={item.name}>
              <Card sx={{height: "100%", display: "flex", flexDirection: "column", transition: "transform 0.2s", "&:hover": { transform: "scale(1.05)" }, borderRadius: "16px", boxShadow: 3, }}>
                <CardMedia component="img" height="200" image={item.image} alt={item.name}/>
                <CardContent>
                  <Typography variant="h6" align="center">
                    {item.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Sezione 4: Chi siamo */}
        <Box sx={{ mt: 5, mb: 5 }}>
          <Typography variant="h4" align="center" gutterBottom sx={sectionHeadingSx}>
            Chi siamo?
          </Typography>
          <Typography variant="body1" align="center" sx={bodyTextSx} paragraph>
            StreetBun è nato dalla passione per il cibo di strada autentico e di qualità. Fondato nel 2020 da un gruppo di amici amanti della cucina tradizionale italiana, il nostro obiettivo è offrire panini freschi e gustosi preparati con ingredienti selezionati. Crediamo che ogni morso debba raccontare una storia di tradizione e innovazione, unendo il sapore del pane artigianale con ripieni creativi e salutari.
          </Typography>
        </Box>

        {/* Sezione 5: Le nostre qualità */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" align="center" gutterBottom sx={sectionHeadingSx}>
            Le nostre qualità
          </Typography>
          <Typography variant="body1" align="center" sx={bodyTextSx} paragraph>
            Utilizziamo solo prodotti locali e di stagione per garantire freschezza e sostenibilità. Il nostro pane è artigianale, lievitato naturalmente senza additivi, e le patatine sono tagliate al momento per una croccantezza unica. Ogni panino è un'esperienza culinaria, preparata con cura per soddisfare i palati più esigenti.
          </Typography>
        </Box>

        {/* Sezione 6: Frase finale */}
        <Box sx={{ mt: 5, pb: 2 }}>
          <Typography variant="h4" align="center" sx={sectionHeadingSx}>
            Vieni a trovarci!
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default Home;