<template>
  <figure class="icon">
    <svg v-if="icon == 'ssr'" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
      <path
        fill="#62bdff"
        d="M36-.008c19.882 0 36 16.118 36 36s-16.118 36-36 36-36-16.118-36-36 16.118-36 36-36z"
      />
      <path
        fill="#FFF"
        d="M61.898 11H46.5A1.5 1.5 0 0 1 45 9.5v-2A1.5 1.5 0 0 1 46.5 6h9.41a36.153 36.153 0 0 1 5.988 5zM41 7.5v2a1.5 1.5 0 0 1-1.5 1.5H10.102a36.153 36.153 0 0 1 5.99-5H39.5A1.5 1.5 0 0 1 41 7.5zm-15 11v2a1.5 1.5 0 0 1-1.5 1.5H2.82a35.93 35.93 0 0 1 2.6-5H24.5a1.5 1.5 0 0 1 1.5 1.5zM16.5 39a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5H.905a35.926 35.926 0 0 1-.77-5H16.5zm5.5 3.5v-2a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5zM31.5 17h18a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-18a1.5 1.5 0 0 1-1.5-1.5v-2a1.5 1.5 0 0 1 1.5-1.5zM35 29.5v2a1.5 1.5 0 0 1-1.5 1.5H.134c.14-1.703.398-3.372.767-5h32.6a1.5 1.5 0 0 1 1.5 1.5zM2.827 50H28.5a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5H5.43a35.952 35.952 0 0 1-2.603-5z"
      />
      <path
        fill="#FFF"
        d="M56 32v.05c-2.8.257-5 2.584-5 5.45v13c0 2.866 2.2 5.193 5 5.45V56a1 1 0 0 1 1 1v2a.99.99 0 0 1-.887.977A9.47 9.47 0 0 1 49 56.317a9.47 9.47 0 0 1-7.113 3.66A.99.99 0 0 1 41 59v-2a1 1 0 0 1 1-1v-.05c2.8-.257 5-2.584 5-5.45v-13c0-2.866-2.2-5.193-5-5.45V32a1 1 0 0 1-1-1v-2c0-.512.39-.92.887-.977A9.47 9.47 0 0 1 49 31.683a9.47 9.47 0 0 1 7.113-3.66A.99.99 0 0 1 57 29v2a1 1 0 0 1-1 1z"
      />
    </svg>
    <svg v-else-if="icon == 'dashboard'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path d="M3.79,3.81H26.28v30H3.79Z" style="fill:#8eccfd" />
      <path d="M60.2,30.21v30.1H37.71V30.21Z" style="fill:#8eccfd" />
      <path d="M37.71,3.8H60.2v15H37.71Z" style="fill:#8eccfd" />
      <path d="M26.28,45.25v15H3.78v-15Z" style="fill:#8eccfd" />
      <path d="M30.05,37.63H0V0h30ZM3.76,3.8v30h22.5V3.8Z" style="fill:#0496ff" />
      <path d="M64,64H34V26.46H64ZM60.2,30.21H37.72V60.26H60.2Z" style="fill:#0496ff" />
      <path d="M64,22.53H34V0H64ZM37.71,3.79v15h22.5v-15Z" style="fill:#0496ff" />
      <path d="M0,64V41.48H30.08V64ZM26.28,45.25H3.78v15h22.5Z" style="fill:#0496ff" />
    </svg>
    <svg v-else-if="icon == 'dashboard2'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path
        d="M16.49,59.65a30,30,0,0,1,31,0,30,30,0,1,0-31,0Z"
        style="fill:none;stroke:#0496ff;stroke-miterlimit:10;stroke-width:4px"
      />
      <path
        d="M33.31,39.73V18.51H30.43V39.8a5.33,5.33,0,1,0,2.88-.07ZM32,46.92a2,2,0,1,1,2-2A2,2,0,0,1,32,46.92Z"
        style="fill:#0496ff"
      />
      <path
        d="M11.57,30.56a20.48,20.48,0,0,1,40.55,0s.14,1.31.18,2.87h3l-.1-1.53a23.36,23.36,0,0,0-46.61,0l-.1,1.53h2.93C11.39,32,11.57,30.56,11.57,30.56Z"
        style="fill:#8eccfd"
      />
      <rect x="30.37" y="8.72" width="3" height="6" rx="1.34"
ry="1.34" style="fill:#0496ff" />
      <rect
        x="45.84"
        y="14.97"
        width="3"
        height="6"
        rx="1.35"
        ry="1.35"
        transform="translate(26.58 -28.21) rotate(45)"
        style="fill:#0496ff"
      />
      <rect
        x="14.92"
        y="14.97"
        width="3"
        height="6"
        rx="1.35"
        ry="1.35"
        transform="translate(-7.9 16.88) rotate(-45)"
        style="fill:#0496ff"
      />
      <rect
        x="8.51"
        y="30.44"
        width="3"
        height="6"
        rx="1.34"
        ry="1.34"
        transform="translate(-23.43 43.46) rotate(-90)"
        style="fill:#0496ff"
      />
      <rect
        x="52.31"
        y="30.44"
        width="3"
        height="6"
        rx="1.34"
        ry="1.34"
        transform="translate(87.25 -20.36) rotate(90)"
        style="fill:#0496ff"
      />
    </svg>
    <svg
      v-else-if="icon == 'slack'"
      viewBox="0 0 147 38"
      width="147"
      height="38"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="#FFF" fill-rule="evenodd">
        <path
          d="M47.08 29.37l1.83-4.25a12.2 12.2 0 0 0 7.2 2.24c1.92 0 3.13-.73 3.13-1.86-.03-3.13-11.48-.68-11.57-8.53-.03-3.98 3.51-7.05 8.53-7.05 2.98 0 5.97.74 8.09 2.42l-1.71 4.34a12.92 12.92 0 0 0-6.67-2.13c-1.57 0-2.6.74-2.6 1.68.03 3.07 11.57 1.4 11.69 8.89 0 4.07-3.45 6.94-8.41 6.94-3.63 0-6.97-.86-9.5-2.69M117.3 23.58a5.28 5.28 0 1 1 0-5.2l5.05-2.8a11.07 11.07 0 1 0 0 10.8l-5.05-2.8zM67.53.74h6.32v30.91h-6.32zM124.83.74v30.9h6.32v-9.27l7.5 9.27h8.08l-9.53-11 8.83-10.28h-7.74l-7.14 8.53V.74z"
        />
        <path
          d="M92.63 23.64a5.83 5.83 0 0 1-4.93 2.63 5.28 5.28 0 1 1 0-10.57 5.83 5.83 0 0 1 4.93 2.72v5.22zm0-13.28v2.51c-1.04-1.74-3.6-2.95-6.29-2.95-5.55 0-9.92 4.9-9.92 11.04 0 6.14 4.37 11.1 9.92 11.1 2.69 0 5.25-1.21 6.29-2.96v2.51h6.31V10.36h-6.31z"
          fill-rule="nonzero"
        />
        <g>
          <path
            d="M8.03 23.61a3.9 3.9 0 1 1-3.9-3.9h3.9v3.9zM9.98 23.61a3.9 3.9 0 1 1 7.79 0v9.75a3.9 3.9 0 1 1-7.8 0V23.6zM13.87 7.97a3.9 3.9 0 1 1 3.9-3.9v3.9h-3.9zM13.87 9.95a3.9 3.9 0 1 1 0 7.79H4.1a3.9 3.9 0 1 1 0-7.8h9.77z"
          />
          <g>
            <path
              d="M29.49 13.84a3.9 3.9 0 1 1 3.9 3.9h-3.9v-3.9zM27.54 13.84a3.9 3.9 0 1 1-7.8 0V4.07a3.9 3.9 0 1 1 7.8 0v9.77z"
            />
          </g>
          <g>
            <path
              d="M23.64 29.46a3.9 3.9 0 1 1-3.9 3.9v-3.9h3.9zM23.64 27.51a3.9 3.9 0 1 1 0-7.8h9.77a3.9 3.9 0 1 1 0 7.8h-9.77z"
            />
          </g>
        </g>
      </g>
    </svg>
    <svg v-else-if="icon == 'open-source'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path
        d="M32,4.05A29.94,29.94,0,0,0,16.49,59.61l.18-.1,9.56-15.9a11.26,11.26,0,1,1,11.59.09l9.49,15.8.2.11A29.94,29.94,0,0,0,32,4.05Z"
        style="fill:#8eccfd;stroke:#0496ff;stroke-miterlimit:10;stroke-width:4px"
      />
    </svg>
    <svg v-else-if="icon == 'open-source2'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path
        d="M32,4.05A29.94,29.94,0,0,0,16.49,59.61l.18-.1,9.56-15.9a11.26,11.26,0,1,1,11.59.09l9.49,15.8.2.11A29.94,29.94,0,0,0,32,4.05Z"
        style="fill:none;stroke:#0496ff;stroke-miterlimit:10;stroke-width:4px"
      />
      <path
        d="M32,10.1h-.16A23.41,23.41,0,0,0,8.54,31.86l-.1,1.54h2.93c0-1.44.2-2.88.2-2.88A20.54,20.54,0,0,1,31.84,13H32Z"
        style="fill:#8eccfd"
      />
    </svg>
    <svg v-else-if="icon == 'build'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path
        d="M38.71,62a10.86,10.86,0,0,0-21.63,0H6.56A4.57,4.57,0,0,1,2,57.44V46.92A10.86,10.86,0,0,0,2,25.29V14.77a4.55,4.55,0,0,1,4.53-4.56H21.69v-2a6.21,6.21,0,1,1,12.41,0v2H49.23a4.56,4.56,0,0,1,4.56,4.56V29.9h2a6.21,6.21,0,1,1,0,12.41h-2V57.44A4.56,4.56,0,0,1,49.23,62Z"
        style="fill:#8eccfd"
      />
      <path
        d="M27.9,4a4.21,4.21,0,0,1,4.2,4.21v4H49.23a2.59,2.59,0,0,1,2.56,2.56V31.9h4a4.21,4.21,0,1,1,0,8.41h-4V57.44A2.59,2.59,0,0,1,49.23,60H40.4a12.86,12.86,0,0,0-25,0H6.56A2.59,2.59,0,0,1,4,57.44V48.61A12.89,12.89,0,0,0,13.85,36.1,12.88,12.88,0,0,0,4,23.61V14.77a2.55,2.55,0,0,1,2.53-2.56H23.69v-4A4.22,4.22,0,0,1,27.9,4m0-4a8.22,8.22,0,0,0-8.21,8.21H6.56A6.55,6.55,0,0,0,0,14.77V27.24H1A8.86,8.86,0,1,1,1,45H0V57.44A6.58,6.58,0,0,0,6.56,64H19V63a8.86,8.86,0,1,1,17.72,0v1H49.23a6.58,6.58,0,0,0,6.56-6.56V44.31a8.21,8.21,0,1,0,0-16.41V14.77a6.58,6.58,0,0,0-6.56-6.56H36.1A8.21,8.21,0,0,0,27.9,0Z"
        style="fill:#0496ff"
      />
    </svg>
    <svg v-else-if="icon == 'build2'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <title>build</title>
      <line
        x1="16.48"
        y1="5.26"
        x2="20.36"
        y2="5.26"
        style="fill:none;stroke:#0496ff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:4px"
      />
      <line
        x1="32.04"
        y1="5.26"
        x2="35.92"
        y2="5.26"
        style="fill:none;stroke:#0496ff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:4px"
      />
      <line
        x1="16.48"
        y1="45.73"
        x2="20.36"
        y2="45.73"
        style="fill:none;stroke:#0496ff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:4px"
      />
      <line
        x1="32.04"
        y1="45.73"
        x2="35.92"
        y2="45.73"
        style="fill:none;stroke:#0496ff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:4px"
      />
      <line
        x1="5.26"
        y1="35.84"
        x2="5.26"
        y2="31.96"
        style="fill:none;stroke:#0496ff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:4px"
      />
      <line
        x1="5.26"
        y1="20.29"
        x2="5.26"
        y2="16.41"
        style="fill:none;stroke:#0496ff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:4px"
      />
      <line
        x1="47.03"
        y1="35.84"
        x2="47.03"
        y2="31.96"
        style="fill:none;stroke:#0496ff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:4px"
      />
      <line
        x1="47.03"
        y1="20.29"
        x2="47.03"
        y2="16.41"
        style="fill:none;stroke:#0496ff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:4px"
      />
      <rect width="10.52" height="10.52" rx="1.96" ry="1.96" style="fill:#0496ff" />
      <rect x="3.96" y="3.96" width="2.61" height="2.61" rx="0.04"
ry="0.04" style="fill:#fff" />
      <rect y="40.46" width="10.52" height="10.52" rx="1.96" ry="1.96"
style="fill:#0496ff" />
      <rect x="3.96" y="44.42" width="2.61" height="2.61" rx="0.04"
ry="0.04" style="fill:#fff" />
      <rect x="41.77" width="10.52" height="10.52" rx="1.96" ry="1.96"
style="fill:#0496ff" />
      <rect x="45.72" y="3.96" width="2.61" height="2.61" rx="0.04"
ry="0.04" style="fill:#fff" />
      <rect x="9.7" y="27.43" width="32.97" height="13.09" style="fill:#8eccfd" />
      <path
        d="M49.09,63.48h0a1.32,1.32,0,0,1-1.2-.82L37.43,36.55a1.31,1.31,0,0,1,.35-1.46,1.3,1.3,0,0,1,1.5-.16L62.77,48a1.28,1.28,0,0,1,.67,1.2,1.3,1.3,0,0,1-.79,1.14L54,54l-3.71,8.65A1.3,1.3,0,0,1,49.09,63.48ZM41.22,39l7.91,19.77,2.67-6.24a1.35,1.35,0,0,1,.68-.69L59.18,49Z"
        style="fill:#0496ff;stroke:#0496ff;stroke-miterlimit:10"
      />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="64" height="64">
      <path
        fill="#62bdff"
        d="M40 43H7a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3h33a3 3 0 0 1 3 3v27a3 3 0 0 1-3 3zM14 20.5a1.5 1.5 0 0 0-1.5-1.5h-2A1.5 1.5 0 0 0 9 20.5v16a1.5 1.5 0 0 0 1.5 1.5h2a1.5 1.5 0 0 0 1.5-1.5v-16zm16 6a1.5 1.5 0 0 0-1.5-1.5h-2a1.5 1.5 0 0 0-1.5 1.5v10a1.5 1.5 0 0 0 1.5 1.5h2a1.5 1.5 0 0 0 1.5-1.5v-10zm8-9a1.5 1.5 0 0 0-1.5-1.5h-2a1.5 1.5 0 0 0-1.5 1.5v19a1.5 1.5 0 0 0 1.5 1.5h2a1.5 1.5 0 0 0 1.5-1.5v-19z"
      />
    </svg>
  </figure>
</template>

<script>
export default {
  props: {
    icon: { type: String, default: "" }
  }
}
</script>

