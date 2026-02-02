import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Audio,
} from "remotion";

// Scene Components
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const textOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  const glowIntensity = Math.sin(frame * 0.1) * 0.3 + 0.7;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Animated background grid */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          transform: `translateY(${frame * 0.5}px)`,
          opacity: 0.5,
        }}
      />

      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 180,
            fontWeight: 900,
            fontFamily: "system-ui, sans-serif",
            background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #10B981 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: `0 0 ${30 * glowIntensity}px rgba(139, 92, 246, 0.5)`,
            letterSpacing: "-0.02em",
          }}
        >
          RIG IT 🔧
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#A78BFA",
            opacity: textOpacity,
            marginTop: 20,
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "0.2em",
          }}
        >
          GAMIFIED RAFFLE ENGINE ON SOLANA
        </div>
      </div>
    </AbsoluteFill>
  );
};

const RigGridScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rigs = Array.from({ length: 36 }, (_, i) => i);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0f0f23 0%, #1a1a3e 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
            opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Choose Your Rig
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#A78BFA",
            marginTop: 10,
            fontFamily: "system-ui, sans-serif",
            opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          36 Rigs • 3 Blocks • Endless Possibilities
        </div>
      </div>

      {/* 6x6 Rig Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 16,
          maxWidth: 900,
        }}
      >
        {rigs.map((rig, index) => {
          const delay = index * 2;
          const scale = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 200 },
          });

          const isHighlighted = frame > 60 && index === Math.floor((frame - 60) / 3) % 36;

          return (
            <div
              key={rig}
              style={{
                width: 120,
                height: 120,
                borderRadius: 16,
                background: isHighlighted
                  ? "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)"
                  : "rgba(139, 92, 246, 0.2)",
                border: isHighlighted
                  ? "3px solid #fff"
                  : "2px solid rgba(139, 92, 246, 0.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transform: `scale(${scale})`,
                boxShadow: isHighlighted
                  ? "0 0 30px rgba(139, 92, 246, 0.8)"
                  : "none",
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: isHighlighted ? "#fff" : "#A78BFA",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {rig + 1}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const FeatureScene: React.FC<{ title: string; subtitle: string; icon: string }> = ({
  title,
  subtitle,
  icon,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  const textSlide = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 150,
            transform: `scale(${iconScale})`,
            marginBottom: 30,
          }}
        >
          {icon}
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
            transform: `translateY(${interpolate(textSlide, [0, 1], [50, 0])}px)`,
            opacity: textSlide,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#A78BFA",
            marginTop: 20,
            fontFamily: "system-ui, sans-serif",
            maxWidth: 800,
            transform: `translateY(${interpolate(textSlide, [0, 1], [30, 0])}px)`,
            opacity: interpolate(textSlide, [0.5, 1], [0, 1]),
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const WinnerRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const winnerNumber = 17;
  const isRevealed = frame > 45;

  const spinNumber = isRevealed
    ? winnerNumber
    : Math.floor(Math.random() * 36) + 1;

  const pulseScale = isRevealed
    ? 1 + Math.sin(frame * 0.3) * 0.05
    : 1;

  const glowIntensity = isRevealed ? 1 : 0;

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at center, #1a1a3e 0%, #0f0f23 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Explosion particles when revealed */}
      {isRevealed &&
        Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const distance = (frame - 45) * 8;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          const opacity = interpolate(frame - 45, [0, 40], [1, 0], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: i % 2 === 0 ? "#8B5CF6" : "#06B6D4",
                transform: `translate(${x}px, ${y}px)`,
                opacity,
              }}
            />
          );
        })}

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 48,
            color: "#A78BFA",
            marginBottom: 30,
            fontFamily: "system-ui, sans-serif",
            opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {isRevealed ? "🎉 WINNER REVEALED 🎉" : "REVEALING WINNER..."}
        </div>

        <div
          style={{
            width: 300,
            height: 300,
            borderRadius: 30,
            background: isRevealed
              ? "linear-gradient(135deg, #10B981 0%, #06B6D4 50%, #8B5CF6 100%)"
              : "rgba(139, 92, 246, 0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${pulseScale})`,
            boxShadow: isRevealed
              ? `0 0 ${60 * glowIntensity}px rgba(16, 185, 129, 0.8)`
              : "0 0 20px rgba(139, 92, 246, 0.3)",
            border: "4px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <span
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: "#fff",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {isRevealed ? winnerNumber : spinNumber}
          </span>
        </div>

        {isRevealed && (
          <div
            style={{
              fontSize: 36,
              color: "#10B981",
              marginTop: 40,
              fontFamily: "system-ui, sans-serif",
              opacity: interpolate(frame - 50, [0, 20], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            Rig #{winnerNumber} Takes the Prize!
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const buttonScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 8, stiffness: 100 },
  });

  const pulse = 1 + Math.sin(frame * 0.15) * 0.03;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 100,
            fontWeight: 900,
            fontFamily: "system-ui, sans-serif",
            background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #10B981 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 20,
            opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          RIG IT 🔧
        </div>

        <div
          style={{
            fontSize: 42,
            color: "#fff",
            marginBottom: 60,
            fontFamily: "system-ui, sans-serif",
            opacity: interpolate(frame, [15, 40], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Pick Your Rig. Stake Your Claim. Win Big.
        </div>

        <div
          style={{
            display: "inline-block",
            padding: "24px 80px",
            borderRadius: 60,
            background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
            fontSize: 36,
            fontWeight: 700,
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
            transform: `scale(${buttonScale * pulse})`,
            boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)",
          }}
        >
          Start Exploring Now
        </div>

        <div
          style={{
            marginTop: 50,
            fontSize: 24,
            color: "#A78BFA",
            fontFamily: "system-ui, sans-serif",
            opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Built on Solana ⚡
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Main Teaser Composition
export const Teaser: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f0f23" }}>
      {/* Scene 1: Intro Logo (0-90 frames / 0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <IntroScene />
      </Sequence>

      {/* Scene 2: Rig Grid (90-180 frames / 3-6s) */}
      <Sequence from={90} durationInFrames={90}>
        <RigGridScene />
      </Sequence>

      {/* Scene 3: Feature - Explorations (180-225 frames / 6-7.5s) */}
      <Sequence from={180} durationInFrames={45}>
        <FeatureScene
          icon="⏱️"
          title="9 Explorations Daily"
          subtitle="2-hour rounds with strategic timing"
        />
      </Sequence>

      {/* Scene 4: Feature - Fair Odds (225-270 frames / 7.5-9s) */}
      <Sequence from={225} durationInFrames={45}>
        <FeatureScene
          icon="⚖️"
          title="Fair Odds for All"
          subtitle="Sublinear weights reduce whale dominance"
        />
      </Sequence>

      {/* Scene 5: Winner Reveal (270-360 frames / 9-12s) */}
      <Sequence from={270} durationInFrames={90}>
        <WinnerRevealScene />
      </Sequence>

      {/* Scene 6: CTA (360-450 frames / 12-15s) */}
      <Sequence from={360} durationInFrames={90}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
