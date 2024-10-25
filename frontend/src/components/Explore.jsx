import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import styled from "styled-components";
import strawberryImage from "../images/strawberry.jpg"; 
import medicineImage from "../images/medicine.jpg";
import aiImage from "../images/ai.jpg"; 
import goldImage from "../images/gold.jpg";
import fireworkImage from "../images/firework.jpg"; 
import santaImage from "../images/santa.jpg"; 
import sweetImage from "../images/sweet.jpg"; 
import weatherImage from "../images/weather.jpg"; 
// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column; /* Stack rows vertically */
  align-items: center; /* Center content horizontally */
  height: 100vh; /* Full viewport height */
  padding: 20px; /* Optional: Add padding around the container */
`;

const CardWrapper = styled.div`
  display: flex; /* Use flex to layout cards */
  justify-content: center; /* Center the row of cards */
  margin: 20px 0; /* Margin between rows */
`;

const StyledCard = styled(Card)`
  width: 220px; /* Adjust width to fit four cards */
  margin: 10px; /* Margin between cards */
  text-align: center;
  position: relative;
  transition: transform 0.2s; /* Adds a hover effect */

  &:hover {
    transform: scale(1.05); /* Scale effect on hover */
  }
`;

const Description = styled(Typography)`
  margin-top: 10px; /* Space above the description */
  color: #555; /* Grey color for the description */
`;

const Explore = () => {
  return (
    <Container style={{marginLeft:'150px'}}>
      {/* First Row of Cards */}
      <CardWrapper>
        <StyledCard>
          <CardMedia
            component="img"
            height="200"
            image={strawberryImage}
            alt="Strawberry"
          />
          <CardContent>
            <Typography variant="h6">Hi, This is Strawberry</Typography>
            <Description variant="body2" style={{marginBottom:'50px'}}>
            Peru has seen a rise in frozen strawberry exports as of September, positioning the country as an important player in international strawberry markets. 
            </Description>
            <a
      href="https://www.freshplaza.com/north-america/article/9670691/peru-s-strawberry-exports-rise-in-september-2024-led-by-frozen-varieties/" // Replace with your target URL
      target="_blank"
      rel="noopener noreferrer"
      className="bg-pink-500 text-white font-semibold py-2 px-4 rounded hover:bg-pink-600 transition duration-300 "
      // mb-12 for 50px bottom margin
    >
      View
    </a>
          </CardContent>
        </StyledCard>

        <StyledCard>
          <CardMedia
            component="img"
            height="200"
            image={medicineImage}
            alt="medicine"
          />
          <CardContent>
            <Typography variant="h6">Hi, This is Medicine</Typography>
            <Description variant="body2"  style={{marginBottom:'50px'}}>
            Researchers have developed more efficient AI diagnostic tools, offering improvements in medical diagnostics.
            </Description>
            <a
      href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9955430/#:~:text=By%20using%20AI%20algorithms%20to,efficient%20and%20effective%20healthcare%20system." // Replace with your target URL
      target="_blank"
      rel="noopener noreferrer"
      className="bg-pink-500 text-white font-semibold py-2 px-4 rounded hover:bg-pink-600 transition duration-300"
       // mb-12 for 50px bottom margin
    >
      View
    </a>
          </CardContent>
        </StyledCard>

        <StyledCard>
          <CardMedia
            component="img"
            height="200"
            image={aiImage}
            alt="AI"
          />
          <CardContent>
            <Typography variant="h6">Hi, This is AI</Typography>
            <Description variant="body2"  style={{marginBottom:'50px'}}>
            AI innovations are pushing boundaries, with companies focusing on developing specialized AI chips for greater efficiency and reducing energy consumption in data centers.
            </Description>
            <a
      href="https://www.alpha-sense.com/blog/trends/generative-ai-transforming-semiconductor-industry/" // Replace with your target URL
      target="_blank"
      rel="noopener noreferrer"
      className="bg-pink-500 text-white font-semibold py-2 px-4 rounded hover:bg-pink-600 transition duration-300 "
      // mb-12 for 50px bottom margin
    >
      View
    </a>
          </CardContent>
        </StyledCard>

        <StyledCard>
          <CardMedia
            component="img"
            height="200"
            image={goldImage}
            alt="Gold"
          />
          <CardContent>
            <Typography variant="h6">Hi, This is Gold</Typography>
            <Description variant="body2"  style={{marginBottom:'50px'}}>
             Exception rise in price in Diwali.Gold, silver, and diamond markets are seeing notable shifts due to economic pressures and rising global demand. For gold, a surge in European and Chinese buying interest is driving prices higher, even as the U.S. dollar strengthens.
            </Description>
            <a
      href="https://economictimes.indiatimes.com/industry/cons-products/fashion-/-cosmetics-/-jewellery/gold-demand-expected-to-surge-this-diwali-despite-record-high-prices/articleshow/114461352.cms?from=mdr" // Replace with your target URL
      target="_blank"
      rel="noopener noreferrer"
      className="bg-pink-500 text-white font-semibold py-2 px-4 rounded hover:bg-pink-600 transition duration-300 "
       // mb-12 for 50px bottom margin
    >
      View
    </a>
          </CardContent>
        </StyledCard>
      </CardWrapper>

      {/* Second Row of Cards */}
      <CardWrapper>
        <StyledCard>
          <CardMedia
            component="img"
            height="200"
            image={fireworkImage}
            alt="Firework"
          />
          <CardContent>
            <Typography variant="h6">Hi, This is Firework</Typography>
            <Description variant="body2"  style={{marginBottom:'50px'}}>
            These crackers produce less smoke and sound, reducing air pollution and noise. Known as "green crackers," they are certified by government bodies like the Council of Scientific and Industrial Research (CSIR) and produce 30-40% fewer emissions.
            </Description>
            <a
      href="https://www.ndtv.com/topic/diwali-fireworks" // Replace with your target URL
      target="_blank"
      rel="noopener noreferrer"
      className="bg-pink-500 text-white font-semibold py-2 px-4 rounded hover:bg-pink-600 transition duration-300 "
       // mb-12 for 50px bottom margin
    >
      View
    </a>
          </CardContent>
        </StyledCard>

        <StyledCard>
          <CardMedia
            component="img"
            height="200"
            image={santaImage}
            alt="santa"
          />
          <CardContent>
            <Typography variant="h6">Hi, This is Santa</Typography>
            <Description variant="body2"  style={{marginBottom:'50px'}}>
            This year, there's a strong move towards unique and personalized decorations. Many are embracing vintage and retro styles, with trees adorned with ornaments from various decades, emphasizing a mix of homemade and upcycled decor
            </Description>
            <a
      href="https://en.wikipedia.org/wiki/Observance_of_Christmas_by_country" // Replace with your target URL
      target="_blank"
      rel="noopener noreferrer"
      className="bg-pink-500 text-white font-semibold py-2 px-4 rounded hover:bg-pink-600 transition duration-300 "
       // mb-12 for 50px bottom margin
    >
      View
    </a>
          </CardContent>
        </StyledCard>

        <StyledCard>
          <CardMedia
            component="img"
            height="200"
            image={sweetImage}
            alt="Sweet"
          />
          <CardContent>
            <Typography variant="h6">Hi, This is Sweet</Typography>
            <Description variant="body2"  style={{marginBottom:'50px'}}>
            With Halloween and other Indian Festivals approaching, there's a significant surge in candy sales as people prepare for trick-or-treating. A recent survey indicated that 76% of Americans and India enjoy celebrating Halloween, and many are gearing up to enjoy or distribute candy. 
            </Description>
            <a
      href="https://www.hindustantimes.com/lifestyle/festivals/diwali-2024-make-your-diwali-feast-eco-friendly-from-homemade-sweets-to-personal-chaat-corner-101729584668497.html" // Replace with your target URL
      target="_blank"
      rel="noopener noreferrer"
      className="bg-pink-500 text-white font-semibold py-2 px-4 rounded hover:bg-pink-600 transition duration-300"
      // mb-12 for 50px bottom margin
    >
      View
    </a>
          </CardContent>
        </StyledCard>

        <StyledCard>
          <CardMedia
            component="img"
            height="200"
            image={weatherImage}
            alt="weather"
          />
          <CardContent>
            <Typography variant="h6">Hi, This is Weather</Typography>
            <Description variant="body2"  style={{marginBottom:'50px'}}>
            As we move into late October, the weather is shifting significantly across many regions. This time of year often sees cooler temperatures in the northern hemisphere
            </Description>
            <a
      href="https://www.hindustantimes.com/india-news/cyclone-dana-landfall-live-updates-tracker-october-25-2024-odisha-west-bengal-coastal-area-101729813617610.html" // Replace with your target URL
      target="_blank"
      rel="noopener noreferrer"
      className="bg-pink-500 text-white font-semibold py-2 px-4 rounded hover:bg-pink-600 transition duration-300"
       // mb-12 for 50px bottom margin
    >
      View
    </a>
          </CardContent>
        </StyledCard>
      </CardWrapper>
    </Container>
  );
};

export default Explore;
