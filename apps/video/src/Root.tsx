import { Composition } from "remotion";
import { Teaser } from "./compositions/Teaser";
import { ShortTeaserA, ShortTeaserB } from "./compositions/ShortTeaser";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Teaser"
        component={Teaser}
        durationInFrames={450} // 15 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ShortTeaserA"
        component={ShortTeaserA}
        durationInFrames={240} // 8 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="ShortTeaserB"
        component={ShortTeaserB}
        durationInFrames={270} // 9 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
