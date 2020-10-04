import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

  * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
  }

  html, body, #root {
      height: 100%;
  }


  body, button, input, select, textarea {
      font-family: 'Roboto', sans-serif;
      -webkit-font-smoothing: antialiased;
      font-size: 16px;

      &:focus {
        outline: none;
      }
  }


  button {
      border: none;
      cursor: pointer;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition: background-color 5500s ease-in-out 0s;
    -webkit-background-color: white !important;
  }
`;
