import { Button, Card, Container, Spinner } from "react-bootstrap";
import {
  BsArrowRight,
  BsFillEnvelopeOpenFill,
  BsGenderAmbiguous,
  BsShareFill,
} from "react-icons/bs";
import { GiAges } from "react-icons/gi";
import { HiMail } from "react-icons/hi";
import { VscSymbolColor, VscTypeHierarchySub } from "react-icons/vsc";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import { usePetAuth } from "../../context/TokenContext";
import { lookUpPet } from "../../routes/API";
import { fetcher } from "../../utils/petInfoFetcher";
import { nameCleaner } from "../../utils/utilsCleaner/index";
import Gallery from "../shared/Gallery";
import FavoriteSection from "./Favorites/FavoriteSection";
import "./PetInfo.css";
import Placeholder from "./placeholder.jpg";

export default function PetInfo() {
  const { id } = useParams<string>();
  const { tokenHeaders } = usePetAuth();

  function handleShare() {
    const shareData = {
      title: pet?.type + " for adoption.",
      text: "Show some love to this animal. Please have a look if you want to adopt this cute life.",
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData);
      // .then((result) => {
      //   console.log("Shared");
      // })
      // .catch((err) => {
      //   console.log(err);
      // });
    }
  }

  const { error, data: pet } = useSWR(
    tokenHeaders ? [lookUpPet + id, tokenHeaders] : null,
    fetcher
  );

  const isLoading = !pet && !error;

  if (isLoading) {
    return (
      <Container className="pawhub py-4">
        <Spinner animation="grow" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }
  if (error || !pet || !id) {
    return <h1>An Error Occurred</h1>;
  }

  return (
    <Container className="pawhub py-4">
      <div className="petInfo">
        <div className="head__section d-flex justify-content-between">
          <h1>{nameCleaner(pet.name)}</h1>

          <FavoriteSection id={id} />
        </div>
        {!pet.photos ? (
          <img src={Placeholder} alt="placeholder" />
        ) : (
          <Gallery
            data={pet.photos.map((p, index) => {
              const largePhoto = p.large ? p.large : Placeholder;
              return { src: largePhoto, title: `${pet.name}-large-${index}` };
            })}
          />
        )}
        <div className="info-body">
          <div className="primary-info">
            <Card.Title>Name - {pet.name}</Card.Title>
            <Card.Text className="description">{pet.description}</Card.Text>
          </div>
          <div className="breed-info">
            <VscTypeHierarchySub className="icon" />
            <Card.Title>Breeds</Card.Title>
            <Card.Text>{pet.breeds.primary}</Card.Text>
          </div>
          <div className="color-info">
            <VscSymbolColor className="icon" />
            <Card.Title>Colors</Card.Title>
            <Card.Text>{pet.colors.primary ?? "N/A"}</Card.Text>
          </div>
        </div>
        <div className="info-body">
          <div className="age-info">
            <GiAges className="icon" />
            <Card.Title>Age</Card.Title>
            <Card.Text>{pet.age}</Card.Text>
          </div>
          <div className="gender-info">
            <BsGenderAmbiguous className="icon" />
            <Card.Title>Gender</Card.Title>
            <Card.Text>{pet.gender}</Card.Text>
          </div>
          <div className="contact-info">
            <HiMail className="icon" />
            <Card.Title>Contact</Card.Title>
            <Card.Text className="contact">
              <a
                href={`mailto:${pet.contact.email}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {pet.contact.email}
              </a>
            </Card.Text>
          </div>
        </div>
        <div className="actions">
          <Button
            as="a"
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn"
            variant="info"
            size="lg"
            href={`mailto:${pet.contact.email}`}
          >
            Contact <BsFillEnvelopeOpenFill />
          </Button>

          <Button
            onClick={handleShare}
            className="action-btn"
            variant="primary"
            size="lg"
          >
            Share <BsShareFill />
          </Button>

          <Button
            as="a"
            href={pet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn"
            variant="success"
            size="lg"
          >
            More Info <BsArrowRight />
          </Button>
        </div>
      </div>
    </Container>
  );
}
