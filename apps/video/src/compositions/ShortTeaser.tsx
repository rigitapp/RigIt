import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
  Audio,
  staticFile,
} from "remotion";

const LIME = "#BEFE46";
const BLACK = "#010101";

// Rig numbers to flash through
const RIG_NUMBERS = ["07", "19", "33", "21", "14", "28", "03", "36", "11", "25", "08", "31"];

const RigFlashScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Speed up flashing, then slow down before stopping
  const flashDuration = 4; // frames per number initially
  const slowdownStart = 90; // frame where we start slowing
  const stopFrame = 140; // frame where it stops on "??"

  let displayValue: string;

  if (frame >= stopFrame) {
    displayValue = "??";
  } else if (frame >= slowdownStart) {
    // Slow down gradually
    const slowProgress = (frame - slowdownStart) / (stopFrame - slowdownStart);
    const currentSpeed = Math.floor(flashDuration + slowProgress * 20);
    const index = Math.floor((frame - slowdownStart) / currentSpeed) % RIG_NUMBERS.length;
    displayValue = RIG_NUMBERS[index];
  } else {
    // Fast flashing
    const index = Math.floor(frame / flashDuration) % RIG_NUMBERS.length;
    displayValue = RIG_NUMBERS[index];
  }

  // Glitch effect - occasional offset
  const glitchX = frame < stopFrame ? (Math.random() > 0.85 ? (Math.random() - 0.5) * 20 : 0) : 0;
  const glitchY = frame < stopFrame ? (Math.random() > 0.85 ? (Math.random() - 0.5) * 10 : 0) : 0;

  // Scale pulse when stopped
  const stoppedPulse = frame >= stopFrame 
    ? 1 + Math.sin((frame - stopFrame) * 0.2) * 0.03 
    : 1;

  // Flash opacity effect
  const flashOpacity = frame < stopFrame 
    ? (frame % 8 < 2 ? 0.7 : 1) 
    : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Scanline effect */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.1) 2px,
            rgba(0, 0, 0, 0.1) 4px
          )`,
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Rig number display */}
      <div
        style={{
          transform: `translate(${glitchX}px, ${glitchY}px) scale(${stoppedPulse})`,
          opacity: flashOpacity,
        }}
      >
        <div
          style={{
            fontSize: 400,
            fontWeight: 900,
            fontFamily: "system-ui, sans-serif",
            color: LIME,
            textShadow: `
              0 0 20px ${LIME},
              0 0 40px ${LIME},
              0 0 80px ${LIME}
            `,
            letterSpacing: "-0.02em",
          }}
        >
          {displayValue}
        </div>
      </div>

      {/* Corner brackets */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          border: `4px solid ${LIME}`,
          borderRadius: 8,
          opacity: 0.3,
        }}
      />
    </AbsoluteFill>
  );
};

const TextRevealScene: React.FC<{ line1: string; line2: string }> = ({ line1, line2 }) => {
  const frame = useCurrentFrame();

  const line1Opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const line2Opacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const line1Y = interpolate(frame, [0, 15], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const line2Y = interpolate(frame, [20, 35], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            fontFamily: "system-ui, sans-serif",
            color: LIME,
            opacity: line1Opacity,
            transform: `translateY(${line1Y}px)`,
            textShadow: `0 0 30px ${LIME}`,
            letterSpacing: "0.05em",
          }}
        >
          {line1}
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            fontFamily: "system-ui, sans-serif",
            color: LIME,
            opacity: line2Opacity,
            transform: `translateY(${line2Y}px)`,
            marginTop: 30,
            textShadow: `0 0 20px ${LIME}`,
            letterSpacing: "0.1em",
          }}
        >
          {line2}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CutToBlackScene: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
      }}
    />
  );
};

// Version A: "CHOOSE YOUR RIG." / "SOON"
export const ShortTeaserA: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      {/* Scene 1: Rig number flashing (0-160 frames / 0-5.3s) */}
      <Sequence from={0} durationInFrames={160}>
        <RigFlashScene />
      </Sequence>

      {/* Scene 2: Text reveal (160-220 frames / 5.3-7.3s) */}
      <Sequence from={160} durationInFrames={60}>
        <TextRevealScene line1="CHOOSE YOUR RIG." line2="SOON" />
      </Sequence>

      {/* Scene 3: Cut to black (220-240 frames / 7.3-8s) */}
      <Sequence from={220} durationInFrames={20}>
        <CutToBlackScene />
      </Sequence>
    </AbsoluteFill>
  );
};

const SoonScene: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const scale = interpolate(frame, [0, 10], [0.9, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 180,
          fontWeight: 900,
          fontFamily: "system-ui, sans-serif",
          color: LIME,
          opacity,
          transform: `scale(${scale})`,
          textShadow: `
            0 0 30px ${LIME},
            0 0 60px ${LIME}
          `,
          letterSpacing: "0.15em",
        }}
      >
        SOON
      </div>
    </AbsoluteFill>
  );
};

// Version B: "EXPLORATION STARTS" / "YOU WON'T GET IT... YET" / "SOON"
export const ShortTeaserB: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      {/* ===== AUDIO TRACKS ===== */}
      
      {/* Background drone/tension - plays throughout */}
      <Audio
        src={staticFile("audio/drone.mp3")}
        volume={0.6}
        startFrom={0}
      />

      {/* Glitch/click sounds during number flashing */}
      <Sequence from={0} durationInFrames={160}>
        <Audio
          src={staticFile("audio/glitch-clicks.mp3")}
          volume={0.8}
        />
      </Sequence>

      {/* Impact hit when stopping on "??" (frame 140) */}
      <Sequence from={140}>
        <Audio
          src={staticFile("audio/impact.mp3")}
          volume={1}
        />
      </Sequence>

      {/* Whoosh on text reveal */}
      <Sequence from={160}>
        <Audio
          src={staticFile("audio/whoosh.mp3")}
          volume={0.7}
        />
      </Sequence>

      {/* Bass hit on "SOON" */}
      <Sequence from={210}>
        <Audio
          src={staticFile("audio/bass-hit.mp3")}
          volume={1}
        />
      </Sequence>

      {/* ===== VISUAL SCENES ===== */}
      
      {/* Scene 1: Rig number flashing (0-160 frames / 0-5.3s) */}
      <Sequence from={0} durationInFrames={160}>
        <RigFlashScene />
      </Sequence>

      {/* Scene 2: Text reveal (160-210 frames / 5.3-7s) */}
      <Sequence from={160} durationInFrames={50}>
        <TextRevealScene line1="EXPLORATION STARTS" line2="YOU WON'T GET IT... YET" />
      </Sequence>

      {/* Scene 3: SOON (210-250 frames / 7-8.3s) */}
      <Sequence from={210} durationInFrames={40}>
        <SoonScene />
      </Sequence>

      {/* Scene 4: Cut to black (250-270 frames / 8.3-9s) */}
      <Sequence from={250} durationInFrames={20}>
        <CutToBlackScene />
      </Sequence>
    </AbsoluteFill>
  );
};
