import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { ContentVideo } from "./ContentVideo";
import { videoData } from "./data";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Universal Vertical Promo Video (1080x1920 @ 30fps) */}
      <Composition
        id="MainPromo"
        component={ContentVideo}
        durationInFrames={videoData.project.totalDurationInFrames}
        fps={videoData.project.fps}
        width={videoData.project.width}
        height={videoData.project.height}
        defaultProps={{
          data: videoData,
        }}
      />

      <Folder name="Templates">
        <Folder name="Elements">
          <Composition
            id="Logo"
            component={Logo}
            durationInFrames={150}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{
              logoColor1: "#91EAE4",
              logoColor2: "#86A8E7",
            }}
          />
          <Composition
            id="Title"
            component={Title}
            durationInFrames={115}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{
              titleText: "Welcome to Remotion",
              titleColor: "#000000",
            }}
          />
        </Folder>
        <Composition
          id="HelloWorld"
          component={HelloWorld}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
    </>
  );
};

