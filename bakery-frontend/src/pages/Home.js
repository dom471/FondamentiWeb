import { Grid, Card, CardMedia, CardContent, Typography, Container, Box } from "@mui/material";
import paneCasereccio from "../immaginiHome/pane-casereccio.jpg";
import pizzaMargherita from "../immaginiHome/pizza-margherita.jpg";
import paneIntegrale from "../immaginiHome/pane-integrale.jpg";
import cornettoCrema from "../immaginiHome/cornetto-crema.jpg";
import focaccia from "../immaginiHome/Focaccia-barese.jpg";
import "./Home.css";

const products = [
  {
    name: "Pane Casereccio",
    image: paneCasereccio,
  },
  {
    name: "Pizza Margherita",
    image: pizzaMargherita,
  },
  {
    name: "Pane Integrale",
    image: paneIntegrale,
  },
  {
    name: "Cornetto alla Crema",
    image: cornettoCrema,
  },
  {
    name: "Focaccia",
    image: focaccia,
  },
];

function Home() {
  return (
    <Container sx={{ py: 5 }}>
      {/* Sezione 1: Titolo e concept */}
      <Box className="home-section" sx={{ textAlign: 'center' }}>
        <Typography variant="h2" className="home-title" gutterBottom sx={{ fontWeight: 'bold', color: '#a1662f' }}>
          StreetBun – Panini street food
        </Typography>
        <Typography variant="h5" className="home-subtitle" color="text.secondary" paragraph>
          Scopri il gusto autentico dei panini artigianali preparati con ingredienti freschi e locali, perfetti per una pausa veloce e deliziosa in movimento.
        </Typography>
      </Box>

      {/* Sezione 2: Dove trovarci */}
      <Box className="home-section">
        <Typography variant="h4" align="center" className="home-title" gutterBottom sx={{ fontWeight: 'bold' }}>
          Dove trovarci
        </Typography>
        <Typography variant="body1" align="center" className="home-subtitle" paragraph>
          Siamo situati in Via Roma 123, Bari, Italia.
        </Typography>
        <Typography variant="body1" align="center" className="home-subtitle" paragraph>
          Orari di apertura: Lunedì-Venerdì 8:00-18:00, Sabato 8:00-14:00, Domenica chiuso.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.123456789012!2d16.88072787728312!3d41.10767945938453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA2JzI3LjYiTiAxNsKwNTInNDIuNiJF!5e0!3m2!1sit!2sit!4v1234567890123!5m2!1sit!2sit"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mappa StreetBun"
          ></iframe>
        </Box>
      </Box>

      {/* Sezione 3: Best sellers */}
      <Typography variant="h4" align="center" color="text.secondary" paragraph sx={{ mb: 5 }}>
        I nostri best seller:
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {products.map((item) => (
          <Grid item key={item.name} xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.05)" },
                borderRadius: "16px",
                boxShadow: 3,
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.name}
              />
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
      <Box className="home-section">
        <Typography variant="h4" align="center" className="home-title" gutterBottom sx={{ fontWeight: 'bold' }}>
          Chi siamo
        </Typography>
        <Typography variant="body1" align="center" className="home-subtitle" paragraph>
          StreetBun è nato dalla passione per il cibo di strada autentico e di qualità. Fondato nel 2020 da un gruppo di amici amanti della cucina tradizionale italiana, il nostro obiettivo è offrire panini freschi e gustosi preparati con ingredienti selezionati. Crediamo che ogni morso debba raccontare una storia di tradizione e innovazione, unendo il sapore del pane appena sfornato con ripieni creativi e salutari.
        </Typography>
      </Box>

      {/* Sezione 5: Le nostre qualità */}
      <Box className="home-section">
        <Typography variant="h4" align="center" className="home-title" gutterBottom sx={{ fontWeight: 'bold' }}>
          Le nostre qualità
        </Typography>
        <Typography variant="body1" align="center" className="home-subtitle" paragraph>
          Utilizziamo solo prodotti locali e di stagione per garantire freschezza e sostenibilità. Il nostro pane è artigianale, lievitato naturalmente senza additivi, e le patatine sono tagliate al momento per una croccantezza unica. Ogni panino è un'esperienza culinaria, preparata con cura per soddisfare i palati più esigenti.
        </Typography>
      </Box>

      {/* Sezione 6: Frase finale */}
      <Box className="home-section" sx={{ textAlign: 'center' }}>
        <Typography variant="h4" className="home-title" sx={{ fontWeight: 'bold', color: '#a1662f' }}>
          Vieni a trovarci
        </Typography>
      </Box>
    </Container>
  );
}

export default Home;

