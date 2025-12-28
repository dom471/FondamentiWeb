import { Grid, Card, CardMedia, CardContent, Typography, Container, Box } from "@mui/material";
import paneCasereccio from "../immaginiHome/pane-casereccio.jpg";
import pizzaMargherita from "../immaginiHome/pizza-margherita.jpg";
import paneIntegrale from "../immaginiHome/pane-integrale.jpg";
import cornettoCrema from "../immaginiHome/cornetto-crema.jpg";
import focaccia from "../immaginiHome/Focaccia-barese.jpg";

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
    <Box sx={{ position: "relative", overflow: "hidden" }}>
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${paneCasereccio})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "scale(1.05)",
          zIndex: 0,
        }}
      />
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)",
          zIndex: 0,
        }}
      />
      <Container sx={{ py: 5, position: "relative", zIndex: 1 }}>
      {/* Sezione 1: Titolo e concept */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'white', textShadow: '3px 3px 6px rgba(0,0,0,0.8)' }}>
          StreetBun – Panini street food
        </Typography>
        <Typography variant="h5" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }} paragraph>
          Scopri il gusto autentico dei panini artigianali preparati con ingredienti freschi e locali, perfetti per una pausa veloce e deliziosa in movimento.
        </Typography>
      </Box>

      {/* Sezione 2: Dove trovarci */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          Dove trovarci e Orari
        </Typography>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }} paragraph>
              Siamo situati difronte all'ingresso del Campus Universitario in via Edoardo Orabona 4.
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }} paragraph>
              Orari di apertura: Lunedì-Venerdì 8:00-20:00, Sabato 8:00-14:00, Domenica chiuso.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d3006.206924665744!2d16.8795251!3d41.1081717!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDA2JzI3LjYiTiAxNsKwNTInNTAuNyJF!5e0!3m2!1sit!2sit!4v1766933810994!5m2!1sit!2sit"
                width="100%"
                height="300"
                style={{ border: 0, maxWidth: '500px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mappa StreetBun"
              ></iframe>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Sezione 3: Best sellers */}
      <Typography variant="h4" align="center" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)', mb: 5 }}>
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
      <Box sx={{ mt: 5, mb: 5 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          Chi siamo
        </Typography>
        <Typography variant="body1" align="center" sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }} paragraph>
          StreetBun è nato dalla passione per il cibo di strada autentico e di qualità. Fondato nel 2020 da un gruppo di amici amanti della cucina tradizionale italiana, il nostro obiettivo è offrire panini freschi e gustosi preparati con ingredienti selezionati. Crediamo che ogni morso debba raccontare una storia di tradizione e innovazione, unendo il sapore del pane appena sfornato con ripieni creativi e salutari.
        </Typography>
      </Box>

      {/* Sezione 5: Le nostre qualità */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          Le nostre qualità
        </Typography>
        <Typography variant="body1" align="center" sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }} paragraph>
          Utilizziamo solo prodotti locali e di stagione per garantire freschezza e sostenibilità. Il nostro pane è artigianale, lievitato naturalmente senza additivi, e le patatine sono tagliate al momento per una croccantezza unica. Ogni panino è un'esperienza culinaria, preparata con cura per soddisfare i palati più esigenti.
        </Typography>
      </Box>

      {/* Sezione 6: Frase finale */}
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', textShadow: '3px 3px 6px rgba(0,0,0,0.8)' }}>
          Vieni a trovarci
        </Typography>
      </Box>
      </Container>
    </Box>
  );
}

export default Home;

