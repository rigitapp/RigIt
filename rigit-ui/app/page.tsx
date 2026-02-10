import { FloatingBlocks } from "@/components/floating-blocks";
import { PixelLogo } from "@/components/pixel-logo";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative w-screen h-screen min-h-screen bg-[#010101] overflow-hidden">
      <FloatingBlocks />

      <div
        className="absolute"
        style={{ left: "4.444vw", top: "48.926vh", width: "41.5vw" }}
      >
        <PixelLogo className="w-full h-auto" />
      </div>

      <div
        className="absolute flex flex-col items-start"
        style={{
          left: "66.389vw",
          top: "27.539vh",
          width: "29.167vw",
          gap: "6.25vh",
        }}
      >
        <nav
          className="flex flex-col items-start"
          style={{ width: "15.5vw", gap: "2.8vh" }}
        >
          <Link
            href="/app"
            className="text-[#BEFE46] font-['IBM_Plex_Mono'] font-normal leading-normal hover:text-[#71A215] hover:underline transition-colors"
            style={{ fontSize: "2vw" }}
          >
            DEMO
          </Link>
          <a
            href="#"
            className="text-[#BEFE46] font-['IBM_Plex_Mono'] font-normal leading-normal hover:text-[#71A215] hover:underline transition-colors"
            style={{ fontSize: "2vw" }}
          >
            LITEPAPER
          </a>
          <a
            href="#"
            className="text-[#BEFE46] font-['IBM_Plex_Mono'] font-normal leading-normal hover:text-[#71A215] hover:underline transition-colors"
            style={{ fontSize: "2vw" }}
          >
            DOCUMENTATION
          </a>

          <div className="flex items-center" style={{ gap: "1.2vw" }}>
            <a
              href="#"
              className="flex items-center justify-center border-[0.5px] border-white text-white hover:text-[#838383] hover:border-[#838383] transition-colors"
              aria-label="X (Twitter)"
              style={{ width: "3vw", height: "3vw", padding: "0.7vw" }}
            >
              <svg className="w-full h-full" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M24.54 24L14.9433 10.0124L14.9597 10.0255L23.6125 0H20.721L13.6721 8.16L8.0745 0H0.491L9.4505 13.0593L9.4494 13.0582L0 24H2.8916L10.7282 14.9215L16.9565 24H24.54ZM6.9288 2.1818L20.3936 21.8182H18.1022L4.6265 2.1818H6.9288Z" fill="currentColor"/>
              </svg>
            </a>

            <a
              href="#"
              className="flex items-center justify-center border-[0.5px] border-white text-white hover:text-[#838383] hover:border-[#838383] transition-colors"
              aria-label="Telegram"
              style={{ width: "3vw", height: "3vw", padding: "0.7vw" }}
            >
              <svg className="w-full h-full" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.3 0C5.5104 0 0 5.5104 0 12.3C0 19.0896 5.5104 24.6 12.3 24.6C19.0896 24.6 24.6 19.0896 24.6 12.3C24.6 5.5104 19.0896 0 12.3 0ZM18.0072 8.364C17.8227 10.3074 17.0232 15.0306 16.6173 17.2077C16.4451 18.1302 16.1007 18.4377 15.7809 18.4746C15.0675 18.5361 14.5263 18.0072 13.8375 17.5521C12.7551 16.8387 12.1401 16.3959 11.0946 15.7071C9.8769 14.9076 10.6641 14.4648 11.3652 13.7514C11.5497 13.5669 14.6985 10.701 14.76 10.4427C14.7685 10.4036 14.7674 10.363 14.7567 10.3244C14.746 10.2858 14.726 10.2504 14.6985 10.2213C14.6247 10.1598 14.5263 10.1844 14.4402 10.1967C14.3295 10.2213 12.6075 11.3652 9.2496 13.6284C8.7576 13.9605 8.3148 14.1327 7.9212 14.1204C7.4784 14.1081 6.642 13.8744 6.0147 13.6653C5.2398 13.4193 4.6371 13.284 4.6863 12.8535C4.7109 12.6321 5.0184 12.4107 5.5965 12.177C9.1881 10.6149 11.5743 9.5817 12.7674 9.0897C16.1868 7.6629 16.8879 7.4169 17.3553 7.4169C17.4537 7.4169 17.6874 7.4415 17.835 7.5645C17.958 7.6629 17.9949 7.7982 18.0072 7.8966C17.9949 7.9704 18.0195 8.1918 18.0072 8.364Z" fill="currentColor"/>
              </svg>
            </a>

            <a
              href="#"
              className="flex items-center justify-center border-[0.5px] border-white text-white hover:text-[#838383] hover:border-[#838383] transition-colors"
              aria-label="GitHub"
              style={{ width: "3vw", height: "3vw", padding: "0.7vw" }}
            >
              <svg className="w-full h-full" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.2979 0C10.6829 0 9.0838 0.318103 7.5917 0.936121C6.0997 1.55414 4.7439 2.46003 3.602 3.602C1.2957 5.9083 0 9.0363 0 12.2979C0 17.7336 3.5295 22.3453 8.4118 23.981C9.0267 24.0793 9.2234 23.6981 9.2234 23.3661V21.2877C5.8169 22.0256 5.0913 19.6398 5.0913 19.6398C4.5256 18.2132 3.7263 17.832 3.7263 17.832C2.6072 17.0695 3.8124 17.0941 3.8124 17.0941C5.0421 17.1802 5.6939 18.3608 5.6939 18.3608C6.7639 20.2301 8.5717 19.6767 9.2726 19.3815C9.3833 18.5822 9.7031 18.0411 10.0474 17.7336C7.3173 17.4262 4.4518 16.3685 4.4518 11.683C4.4518 10.318 4.9192 9.2234 5.7185 8.3503C5.5956 8.0428 5.1651 6.7639 5.8415 5.1036C5.8415 5.1036 6.8745 4.7716 9.2234 6.358C10.195 6.0875 11.2526 5.9522 12.2979 5.9522C13.3432 5.9522 14.4009 6.0875 15.3724 6.358C17.7213 4.7716 18.7543 5.1036 18.7543 5.1036C19.4307 6.7639 19.0003 8.0428 18.8773 8.3503C19.6767 9.2234 20.144 10.318 20.144 11.683C20.144 16.3808 17.2663 17.4139 14.5238 17.7213C14.9666 18.1025 15.3724 18.8527 15.3724 19.9964V23.3661C15.3724 23.6981 15.5692 24.0916 16.1964 23.981C21.0786 22.333 24.5958 17.7336 24.5958 12.2979C24.5958 10.6829 24.2778 9.0838 23.6597 7.5917C23.0417 6.0997 22.1358 4.7439 20.9939 3.602C19.8519 2.46 18.4962 1.55414 17.0041 0.936121C15.5121 0.318103 13.9129 0 12.2979 0Z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </nav>

        <Link
          href="/app"
          className="group button-zoom flex items-center justify-center bg-[#BEFE46] hover:bg-[#010101] border-[5px] border-transparent hover:border-[#BEFE46] transition-all duration-300 ease-out"
          style={{
            width: "26vw",
            height: "6.8vh",
            padding: "2vh 2.4vw",
            gap: "1vw",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "1.55vw", height: "2vw" }}
            className="transition-transform duration-300 ease-out"
          >
            <path className="group-hover:fill-[#BEFE46] transition-colors duration-300 ease-out" fillRule="evenodd" clipRule="evenodd" d="M6.33604 14.6668C7.20877 15.7847 8.21541 16.7914 9.3334 17.6641V23.0002C9.3334 23.5522 9.7814 24.0002 10.3334 24.0002C11.3701 24.0004 12.3927 23.7588 13.3197 23.2947C14.2467 22.8305 15.0527 22.1565 15.6736 21.3263C16.2946 20.496 16.7133 19.5324 16.8966 18.512C17.0799 17.4916 17.0226 16.4425 16.7294 15.4481C19.0279 13.8121 20.8915 11.6389 22.158 9.11797C23.4245 6.59699 24.0556 3.80462 23.9962 0.984007C23.991 0.725695 23.8862 0.479389 23.7035 0.296699C23.5208 0.11401 23.2745 0.00911663 23.0162 0.00400005L22.6668 0C16.8454 0 11.6934 2.87069 8.55206 7.27072C7.55764 6.97752 6.50854 6.9203 5.48813 7.10358C4.46772 7.28686 3.50411 7.7056 2.67388 8.32653C1.84365 8.94745 1.16967 9.75345 0.705505 10.6805C0.241337 11.6075 -0.000229069 12.63 1.62993e-07 13.6668C1.62993e-07 14.2188 0.448003 14.6668 1.00001 14.6668H6.33604ZM16.0001 10.6667C16.7074 10.6667 17.3856 10.3858 17.8857 9.88568C18.3858 9.38558 18.6668 8.7073 18.6668 8.00005C18.6668 7.2928 18.3858 6.61452 17.8857 6.11442C17.3856 5.61432 16.7074 5.33337 16.0001 5.33337C15.2929 5.33337 14.6146 5.61432 14.1145 6.11442C13.6144 6.61452 13.3334 7.2928 13.3334 8.00005C13.3334 8.7073 13.6144 9.38558 14.1145 9.88568C14.6146 10.3858 15.2929 10.6667 16.0001 10.6667Z" fill="#010101"/>
          </svg>
          <span
            className="text-[#010101] group-hover:text-[#BEFE46] font-['IBM_Plex_Mono'] font-normal leading-normal transition-all duration-300 ease-out"
            style={{
              fontSize: "1.5vw",
              transformOrigin: "center",
            }}
          >
            DIVE IN
          </span>
        </Link>
      </div>
    </div>
  );
}
