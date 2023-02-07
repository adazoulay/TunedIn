import React from "react";

function Icon({ type }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={type === "large" ? "690" : "345"}
      height={type === "large" ? "146 " : "73"}
      fill='none'
      viewBox='0 0 190 40'>
      <path stroke='url(#a)' strokeWidth='0.75' d='M42.215 13.968l21.69 18.383'></path>
      <path stroke='url(#b)' strokeWidth='0.75' d='M68.574 8.757l12.086-5.12'></path>
      <path stroke='url(#c)' strokeWidth='0.75' d='M80.854 3.859L91.82 14.146'></path>
      <path stroke='url(#d)' strokeWidth='0.75' d='M68.574 8.757l23.044 5.51'></path>
      <path stroke='url(#e)' strokeWidth='0.75' d='M42.215 13.968l26.359-5.211'></path>
      <path stroke='url(#f)' strokeWidth='0.75' d='M35.07 27.683l28.836 4.668'></path>
      <path stroke='url(#g)' strokeWidth='0.75' d='M42.215 13.968L35.07 27.683'></path>
      <path stroke='url(#h)' strokeWidth='0.75' d='M91.695 14.31l-27.79 18.04'></path>
      <path stroke='url(#i)' strokeWidth='0.75' d='M68.574 9.003L63.906 32.35'></path>
      <path
        fill='#FF006E'
        d='M35.966 30.017a2.5 2.5 0 10-1.792-4.668 2.5 2.5 0 001.792 4.668z'></path>
      <path
        fill='#FFEA00'
        d='M92.501 16.513a2.25 2.25 0 10-1.612-4.201 2.25 2.25 0 001.612 4.2z'></path>
      <path
        fill='#14FF00'
        d='M81.427 6.024a2.5 2.5 0 10-1.792-4.668 2.5 2.5 0 001.792 4.668z'></path>
      <path
        fill='#EB00FF'
        d='M69.47 11.09a2.5 2.5 0 10-1.792-4.667 2.5 2.5 0 001.792 4.668z'></path>
      <path
        fill='#0015FF'
        d='M43.111 16.302a2.5 2.5 0 10-1.792-4.668 2.5 2.5 0 001.792 4.668z'></path>
      <path
        fill='#EBEBEB'
        d='M46.248 30.913V13.288h2.675l6.25 11.525 6.225-11.525h2.625v17.625h-2.9V19.038l-5.05 9.2h-1.875l-5.05-9.15v11.825h-2.9zm27.88.25c-1.384 0-2.576-.259-3.576-.775a5.59 5.59 0 01-2.325-2.2c-.533-.95-.8-2.075-.8-3.375 0-1.267.259-2.375.775-3.325a5.814 5.814 0 012.175-2.225c.934-.55 1.992-.825 3.175-.825 1.734 0 3.1.55 4.1 1.65 1.017 1.1 1.525 2.6 1.525 4.5v.925h-8.75c.234 2.183 1.484 3.275 3.75 3.275.684 0 1.367-.1 2.05-.3a5.82 5.82 0 001.875-1l.875 2.1c-.583.483-1.316.866-2.2 1.15a8.634 8.634 0 01-2.65.425zm-.45-10.6c-.917 0-1.659.283-2.226.85-.566.566-.908 1.333-1.025 2.3h6.15c-.066-1.017-.35-1.792-.85-2.325-.483-.55-1.166-.825-2.05-.825zm12.724 10.6c-1.45 0-2.525-.392-3.225-1.175-.683-.8-1.025-1.967-1.025-3.5v-13.2h3.125v13.05c0 1.5.634 2.25 1.9 2.25.184 0 .367-.009.55-.025.184-.017.359-.05.525-.1l-.05 2.475c-.6.15-1.2.225-1.8.225zm9.809 0c-1.267 0-2.367-.259-3.3-.775a5.422 5.422 0 01-2.175-2.2c-.517-.967-.775-2.1-.775-3.4 0-1.3.258-2.425.775-3.375a5.422 5.422 0 012.175-2.2c.933-.517 2.033-.775 3.3-.775 1.266 0 2.366.258 3.3.775a5.424 5.424 0 012.175 2.2c.516.95.775 2.075.775 3.375 0 1.3-.259 2.433-.775 3.4a5.424 5.424 0 01-2.175 2.2c-.934.516-2.034.775-3.3.775zm0-2.375c.933 0 1.683-.334 2.25-1 .566-.684.85-1.684.85-3 0-1.334-.284-2.325-.85-2.975-.567-.667-1.317-1-2.25-1-.934 0-1.684.333-2.25 1-.567.65-.85 1.641-.85 2.975 0 1.316.283 2.316.85 3 .566.666 1.316 1 2.25 1zm9.379 2.125V13.288h2.4l9.475 12.3v-12.3h2.975v17.625h-2.375l-9.5-12.35v12.35h-2.975zm24.926.25c-1.383 0-2.575-.259-3.575-.775a5.59 5.59 0 01-2.325-2.2c-.533-.95-.8-2.075-.8-3.375 0-1.267.258-2.375.775-3.325a5.809 5.809 0 012.175-2.225c.933-.55 1.992-.825 3.175-.825 1.733 0 3.1.55 4.1 1.65 1.017 1.1 1.525 2.6 1.525 4.5v.925h-8.75c.233 2.183 1.483 3.275 3.75 3.275.683 0 1.367-.1 2.05-.3a5.828 5.828 0 001.875-1l.875 2.1c-.583.483-1.317.866-2.2 1.15a8.635 8.635 0 01-2.65.425zm-.45-10.6c-.917 0-1.658.283-2.225.85-.567.566-.908 1.333-1.025 2.3h6.15c-.067-1.017-.35-1.792-.85-2.325-.483-.55-1.167-.825-2.05-.825zm14.026 10.6c-3.233 0-4.85-1.6-4.85-4.8v-5.325h-2.35v-2.35h2.35v-3.65h3.125v3.65h3.7v2.35h-3.7v5.15c0 .8.175 1.4.525 1.8.35.4.917.6 1.7.6.233 0 .475-.025.725-.075.25-.067.508-.134.775-.2l.475 2.3c-.3.166-.683.3-1.15.4-.45.1-.892.15-1.325.15z'></path>
      <path
        fill='#FB5607'
        d='M64.802 34.685a2.5 2.5 0 10-1.792-4.668 2.5 2.5 0 001.792 4.668z'></path>
      <defs>
        <linearGradient
          id='a'
          x1='62.478'
          x2='43.227'
          y1='30.823'
          y2='14.901'
          gradientUnits='userSpaceOnUse'>
          <stop stopColor='#FB5607'></stop>
          <stop offset='1' stopColor='#0015FF'></stop>
        </linearGradient>
        <linearGradient
          id='b'
          x1='78.597'
          x2='70.862'
          y1='4.555'
          y2='8.179'
          gradientUnits='userSpaceOnUse'>
          <stop offset='0.026' stopColor='#14FF00'></stop>
          <stop offset='1' stopColor='#EB00FF'></stop>
        </linearGradient>
        <linearGradient
          id='c'
          x1='90.513'
          x2='82.734'
          y1='12.78'
          y2='5.414'
          gradientUnits='userSpaceOnUse'>
          <stop stopColor='#FFEA00'></stop>
          <stop offset='1' stopColor='#14FF00'></stop>
        </linearGradient>
        <linearGradient
          id='d'
          x1='89.891'
          x2='71.414'
          y1='13.882'
          y2='8.757'
          gradientUnits='userSpaceOnUse'>
          <stop stopColor='#FFEA00'></stop>
          <stop offset='1' stopColor='#EB00FF'></stop>
        </linearGradient>
        <linearGradient
          id='e'
          x1='66.753'
          x2='55.966'
          y1='9.157'
          y2='22.881'
          gradientUnits='userSpaceOnUse'>
          <stop stopColor='#EB00FF'></stop>
          <stop offset='1' stopColor='#0015FF'></stop>
        </linearGradient>
        <linearGradient
          id='f'
          x1='62.496'
          x2='43.724'
          y1='32.351'
          y2='41.623'
          gradientUnits='userSpaceOnUse'>
          <stop stopColor='#FB5607'></stop>
          <stop offset='0.885' stopColor='#FF006E'></stop>
        </linearGradient>
        <linearGradient
          id='g'
          x1='41.59'
          x2='35.187'
          y1='15.147'
          y2='15.537'
          gradientUnits='userSpaceOnUse'>
          <stop stopColor='#0015FF'></stop>
          <stop offset='1' stopColor='#FF006E'></stop>
        </linearGradient>
        <linearGradient
          id='h'
          x1='90.388'
          x2='63.841'
          y1='15.505'
          y2='26.257'
          gradientUnits='userSpaceOnUse'>
          <stop stopColor='#FFEA00'></stop>
          <stop offset='1' stopColor='#FB5607'></stop>
        </linearGradient>
        <linearGradient
          id='i'
          x1='68.574'
          x2='66.605'
          y1='10.904'
          y2='10.672'
          gradientUnits='userSpaceOnUse'>
          <stop stopColor='#EB00FF'></stop>
          <stop offset='1' stopColor='#FB5607'></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default Icon;
