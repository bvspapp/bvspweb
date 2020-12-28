import styled from 'styled-components';
import 'react-image-gallery/styles/css/image-gallery.css';

export const Container = styled.div`
  display: flex;
  flex: 1;

  .image-gallery-fullscreen-button {
    color: ${props => props.theme.colors.primary};
  }

  .image-gallery-thumbnails-wrapper {
    margin-top: 25px;
  }

  .image-gallery-thumbnail-image {
    max-height: 70px;
  }

  .fullscreen,
  .image-gallery .image-gallery-using-mouse {
    background: #fff;
    height: 100vh;
  }

  .bottom:focus {
    outline: 0;
  }

  .image-gallery-icon {
    color: ${props => props.theme.colors.white};

    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }

  .image-gallery-slides img {
    height: 300px;
  }

  .fullscreen img {
    margin-top: 10px;
    height: 80vh;
  }
`;
