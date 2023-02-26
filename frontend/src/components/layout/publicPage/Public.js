import Logo from "../../../assets/Logo";
import PostImg from "./publicPageAssets/post.png";
import createTagImg from "./publicPageAssets/createTag.png";
import AuthDropdown from "./AuthDropdown";
import "./public.scss";

// import createPostImg from "./publicPageAssets/createPost.png";

const Public = () => {
  const content = (
    <div className='public-layout'>
      <div className='public-header'>
        <div className='public-logo'>
          <Logo type='large' />
        </div>
        <div className='wave'>
          <svg
            data-name='Layer 1'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'>
            <path
              d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z'
              opacity='.25'
              className='shape-fill'></path>
            <path
              d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z'
              opacity='.5'
              className='shape-fill'></path>
            <path
              d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z'
              className='shape-fill'></path>
          </svg>
        </div>
      </div>
      <div className='public-body'>
        <div className='body-upper'>
          <div className='welcome-text'>
            <h1 className='intro'> Welcome</h1>
            <h2>Please sign in or Sign up to continue</h2>
            <h3>Only chrome is well supported for now</h3>
          </div>
          <AuthDropdown />
        </div>
        <div className='public-info'>
          <div className='post-preview'>
            <img src={PostImg} className='post-img' alt='Post' />
            <div className='desc-text'>
              <h2>
                Create posts and share your thoughts, opinions and experiences about the music
                you love.
              </h2>
              <h2>
                Enhance your music listening experience by uploading lossless audio files for a
                higher quality sound. Immerse yourself in your favorite songs like never before
                and enjoy the rich, clear audio that lossless files provide.
              </h2>
            </div>
          </div>
          <div className='create-tag-preview'>
            <img src={createTagImg} className='tag-img' alt='Create Tag' />
            <div className='desc-text'>
              <h2>
                The &quot;tag&quot; system, allows you to join and contribute to small
                communities that represent specific music genres or niches.
              </h2>
              <h2>
                Tags have a hierarchical structure, allowing for easy discovery based on
                musical influences and related genres. Explore and connect with others who
                share your musical interests, from classic rock to modern pop and everything in
                between.
              </h2>
              <h2>
                Whether you&apos;re a fan of classical music or love to headbang to heavy
                metal, there&apos;s a tag for you. If not, create one!
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className='wave-divider'></div>
      <div className='roadmap-section'>
        <div className='roadmap'>
          <h1>Roadmap</h1>
          <ul>
            <li>Post page with more post details</li>
            <li>Broadcast page for simple widespread communication</li>
            <li>Add vide/gif/img content to posts</li>
            <li>Add img background to tags as an option</li>
            <li>WASM synth</li>
            <li>Direct messaging</li>
            <li>Buy/Sell items</li>
          </ul>
        </div>
      </div>
      <div className='public-footer'>
        <div className='wave-footer'></div>
        <div className='credits'>
          <div>Created solely by Adam Azoulay</div>
          <div className='credits-col'>
            If you like this project and want to help out feel free to reach out!
            <div className='social-links'>
              <a>https://www.linkedin.com/in/aazoulay/</a>
              <a>https://github.com/adazoulay/TunedIn</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return content;
};
export default Public;
