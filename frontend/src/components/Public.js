import { Link } from "react-router-dom";
import "./public.css";

const Public = () => {
  const content = (
    <body>
      <main className='container'>
        <div className='box'>1</div>
        <div className='box'>2</div>
        <div className='box'>3</div>
        <div className='box'>4</div>
        <div className='box'>5</div>
        <div className='box'>6</div>
      </main>
    </body>
  );
  return content;
};
export default Public;
