import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Stats } from '@react-three/drei';
import { Tabs, Button, Space, message, Slider } from 'antd';
import * as THREE from 'three';

function Box() {
    return (
        <mesh rotation={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
}

function BeeModel({ onActionsLoaded, speed }) {
    const { scene, animations } = useGLTF('/bee2.glb');
    const mixerRef = useRef();
    const modelRef = useRef();

    useEffect(() => {
        if (animations && !mixerRef.current) {
            console.log('Bee animations:', animations);

            // 创建动画混合器
            const mixer = new THREE.AnimationMixer(scene);
            mixerRef.current = mixer;

            // 获取所有动画片段
            const newActions = {};
            animations.forEach((clip) => {
                console.log('Processing bee animation:', clip.name);
                if (clip.tracks.length > 0) {
                    const action = mixer.clipAction(clip);
                    action.reset();
                    action.setEffectiveTimeScale(speed);
                    action.setEffectiveWeight(0);
                    newActions[clip.name] = action;
                } else {
                    console.log('Skipping empty bee animation:', clip.name);
                }
            });

            onActionsLoaded(newActions);

            // 默认播放第一个动画
            if (Object.keys(newActions).length > 0) {
                const firstAction = Object.values(newActions)[0];
                firstAction.setEffectiveWeight(1);
                firstAction.play();
                console.log('Playing first bee animation:', firstAction.getClip().name);
            }
        }
    }, [animations, onActionsLoaded, speed, scene]);

    // 更新动画速度
    useEffect(() => {
        if (mixerRef.current) {
            const currentActions = mixerRef.current._actions;
            Object.values(currentActions).forEach(action => {
                action.setEffectiveTimeScale(speed);
            });
        }
    }, [speed]);

    // 使用 useFrame 更新动画
    useFrame((state, delta) => {
        if (mixerRef.current) {
            mixerRef.current.update(delta);
        }
    });

    return (
        <primitive
            ref={modelRef}
            object={scene}
            scale={0.2}
            position={[0, -0.9, 0]}
        />
    );
}

function AnimatedDefaultModel({ onActionsLoaded }) {
    const { scene, animations } = useGLTF('/defult.glb');
    const mixerRef = useRef();
    const modelRef = useRef();

    useEffect(() => {
        if (scene && animations && !mixerRef.current) {
            console.log('Default model scene:', scene);
            console.log('Default model animations:', animations);

            // 创建动画混合器
            const mixer = new THREE.AnimationMixer(scene);
            mixerRef.current = mixer;

            const newActions = {};
            animations.forEach((clip) => {
                console.log('Processing default model animation:', clip.name);
                if (clip.tracks.length > 0) {
                    const action = mixer.clipAction(clip);
                    action.reset();
                    action.setEffectiveTimeScale(1.0);
                    action.setEffectiveWeight(0);
                    newActions[clip.name] = action;
                } else {
                    console.log('Skipping empty default animation:', clip.name);
                }
            });

            onActionsLoaded(newActions);

            // 默认播放第一段动画
            if (Object.keys(newActions).length > 0) {
                const firstAction = Object.values(newActions)[0];
                firstAction.setEffectiveWeight(1);
                firstAction.play();
                console.log('Playing first default animation:', firstAction.getClip().name);
            }
        }
    }, [scene, animations, onActionsLoaded]);

    useFrame((_, delta) => {
        if (mixerRef.current) {
            mixerRef.current.update(delta);
        }
    });

    return (
        <primitive
            ref={modelRef}
            object={scene}
            scale={0.2}
            position={[0, -0.9, 0]}
        />
    );
}

function Scene({ children }) {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Environment files="/hdri/venice_sunset_1k.hdr" />
            {children}
            <OrbitControls
                target={[0, 0, 0]}
                minDistance={2}
                maxDistance={10}
                maxPolarAngle={Math.PI / 2}
            />
        </>
    );
}

function SceneContainer({ children }) {
    return (
        <div style={{
            width: '100%',
            height: '500px',
            border: '2px solid #1890ff',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#f0f0f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            position: 'relative'
        }}>
            {children}
        </div>
    );
}

// 外部模型统计组件（备用方案，放在Canvas外部）
function ModelStatistics() {
    return (
        <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 1000
        }}>
            <div>顶点数: 计算中...</div>
            <div>三角形: 计算中...</div>
            <div>材质: 计算中...</div>
            <div>纹理: 计算中...</div>
            <div>绘制调用: 计算中...</div>
        </div>
    );
}

function WebGLTest() {
    const [beeActions, setBeeActions] = useState({});
    const [beeSpeed, setBeeSpeed] = useState(1.0);
    const [defaultActions, setDefaultActions] = useState({});

    const handleBeeActionsLoaded = (newActions) => {
        console.log('Bee actions loaded:', Object.keys(newActions));
        setBeeActions(newActions);
    };

    const handleDefaultActionsLoaded = (newActions) => {
        console.log('Default model actions loaded:', Object.keys(newActions));
        setDefaultActions(newActions);
    };

    const playAnimation = (actionName, model = 'human') => {
        let currentActions;
        switch (model) {
            case 'bee':
                currentActions = beeActions;
                break;
            case 'default':
                currentActions = defaultActions;
                break;
            default:
                currentActions = {};
                break;
        }

        if (!currentActions[actionName]) {
            message.error(`Animation ${actionName} not found`);
            return;
        }

        console.log('Playing animation:', actionName, 'on model:', model);

        // 停止所有动画
        Object.values(currentActions).forEach(action => {
            action.setEffectiveWeight(0);
            action.stop();
            action.reset();
        });

        // 播放选中的动画
        const selectedAction = currentActions[actionName];
        selectedAction.reset();
        selectedAction.setEffectiveWeight(1);
        selectedAction.play();
    };

    return (
        <div style={{ width: '100%', height: '500px' }}>
            <Tabs
                items={[
                    {
                        key: '1',
                        label: '基础立方体',
                        children: (
                            <SceneContainer>
                                <Canvas>
                                    <Scene>
                                        <Box />
                                    </Scene>
                                    <Stats showPanel={0} className="stats-panel" />
                                </Canvas>
                            </SceneContainer>
                        ),
                    },
                    {
                        key: '3',
                        label: '蜜蜂模型',
                        children: (
                            <SceneContainer>
                                <Space direction="vertical" style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
                                    <Space>
                                        {Object.keys(beeActions).map((actionName) => (
                                            <Button
                                                key={actionName}
                                                type="primary"
                                                onClick={() => playAnimation(actionName, 'bee')}
                                            >
                                                {actionName}
                                            </Button>
                                        ))}
                                    </Space>
                                    <Space>
                                        <span>动画速度:</span>
                                        <Slider
                                            min={0.1}
                                            max={2}
                                            step={0.1}
                                            value={beeSpeed}
                                            onChange={setBeeSpeed}
                                            style={{ width: 100 }}
                                        />
                                        <span>{beeSpeed}x</span>
                                    </Space>
                                </Space>
                                <ModelStatistics />
                                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                                    <Scene>
                                        <Suspense fallback={null}>
                                            <BeeModel onActionsLoaded={handleBeeActionsLoaded} speed={beeSpeed} />
                                        </Suspense>
                                    </Scene>
                                    <Stats showPanel={0} className="stats-panel" />
                                </Canvas>
                            </SceneContainer>
                        ),
                    },
                    {
                        key: '4',
                        label: '默认动画模型',
                        children: (
                            <SceneContainer>
                                <Space style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
                                    {Object.keys(defaultActions).map((actionName) => (
                                        <Button
                                            key={actionName}
                                            type="primary"
                                            onClick={() => playAnimation(actionName, 'default')}
                                        >
                                            {actionName}
                                        </Button>
                                    ))}
                                </Space>
                                <ModelStatistics />
                                <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
                                    <Scene>
                                        <Suspense fallback={null}>
                                            <AnimatedDefaultModel onActionsLoaded={handleDefaultActionsLoaded} />
                                        </Suspense>
                                    </Scene>
                                    <Stats showPanel={0} className="stats-panel" />
                                </Canvas>
                            </SceneContainer>
                        ),
                    },
                ]}
            />
        </div>
    );
}

// 添加全局样式以优化Stats面板位置
const style = document.createElement('style');
style.textContent = `
  .stats-panel {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
  }
`;
document.head.appendChild(style);

export default WebGLTest;
