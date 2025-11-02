import { Grid, Card, CardMedia, CardContent, Typography, Container } from "@mui/material";
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
    <Container sx={{ py: 5 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Benvenuto nel Panificio da Stefàno!
      </Typography>

      <Typography
        variant="h4"
        align="center"
        color="text.secondary"
        paragraph
        sx={{ mb: 5 }}
      >
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
    </Container>
  );
}

export default Home;

