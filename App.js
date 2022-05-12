import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { Suspense, useRef, useState, useMemo } from "react";
import {
  Canvas,
  MeshProps,
  useFrame,
  useLoader,
} from "@react-three/fiber/native";
// import { GLTFLoader } from "expo-three";
import { ObjectLoader } from "three";
import { Asset } from "expo-asset";
import { MTLLoader, OBJLoader } from "three-stdlib";
import { THREE } from "expo-three";
import { loadObjAsync, loadTextureAsync } from "expo-three";
import { resolveAsync } from "expo-asset-utils";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FileSystem } from "expo-file-system";
import { decode } from "base64-arraybuffer";

global.THREE = global.THREE || THREE;

// this was actually copied from node_modules\expo-three\build\loaders\loadModelsAsync.js
async function loadFileAsync({ asset, funcName }) {
  if (!asset) {
    throw new Error(`ExpoTHREE.${funcName}: Cannot parse a null asset`);
  }
  return (await resolveAsync(asset)).localUri ?? null;
}

// newly added method
export async function loadGLTFAsync({ asset, onAssetRequested }) {
  const uri = await loadFileAsync({
    asset,
    funcName: "loadGLTFAsync",
  });
  if (!uri) return;
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  console.log(base64);
  const arrayBuffer = decode(base64);
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.parse(
      arrayBuffer,
      onAssetRequested,
      (result) => {
        resolve(result);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

function Box(props) {
  const mesh = useRef(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (mesh.current.rotation.x += 0.01));
  const a = useLoader(
    OBJLoader,
    "https://groups.csail.mit.edu/graphics/classes/6.837/F03/models/cow-nonormals.obj"
  );

  // const b = useLoader(GLTFLoader, "/shoe.glb");

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 0.5}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <primitive object={a} />
      {/* <sphereGeometry args={[1, 68, 68]} /> */}
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        {/* <Box position={[1.2, 0, 0]} /> */}
        {/* <ChairModel /> */}
      </Suspense>
    </Canvas>
  );
}

async function ChairModel({ ...props }) {
  console.log("helo");
  // const asset = Asset.fromModule(require("./assets/models/SheenChair.glb"));
  // await asset.downloadAsync();
  // const loader = new GLTFLoader();
  // console.log(asset.uri);
  // loader.load(
  //   asset.uri,
  //   (gltf) => {
  //     console.log(gltf);
  //     model = gltf.scene;
  //     scene.add(model);
  //   },
  //   (xhr) => {
  //     console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
  //   },
  //   (error) => {
  //     console.error("An error happened", error);
  //   }
  // );
  const gltf = await loadGLTFAsync({
    asset: require("./assets/models/SheenChair.glb"),
  });
  const { nodes, materials } = gltf;

  // const group = useRef(null);
  // Create an Asset from a resource
  // const asset = Asset.fromModule(require("./assets/models/SheenChair.glb"));

  // await asset.downloadAsync();

  // // This is the local URI
  // const uri = asset.localUri;

  // const loader = new GLTFLoader();
  // await loader.load(uri, (group) => {
  //   console.log(group);
  // });

  // "https://thinkuldeep.com/modelviewer/Astronaut.glb";

  // return (
  //   <group {...props} dispose={null} scale={3}>
  //     <mesh
  //       geometry={nodes.SheenChair_fabric.geometry}
  //       material={materials["fabric Mystere Mango Velvet"]}
  //       material-color={props.customColors.mesh}
  //     ></mesh>
  //     <mesh
  //       geometry={nodes.SheenChair_wood.geometry}
  //       material={materials["wood Brown"]}
  //       material-color={props.customColors.sole}
  //     />
  //     <mesh
  //       geometry={nodes.SheenChair_metal.geometry}
  //       material={materials.metal}
  //       material-color={props.customColors.stripes}
  //     />
  //     <mesh
  //       geometry={nodes.SheenChair_label.geometry}
  //       material={materials.label}
  //       position={[0, 0.24, 0.06]}
  //       rotation={[-0.09, 0, 0]}
  //     />
  //   </group>
  // );
}

// useGLTF.preload("./assets/models/SheenChair.glb");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
