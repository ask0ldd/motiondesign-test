import { createRef } from '@revideo/core';
import '../global.css';
import { NodeProps, Rect, Txt, Node, initial, colorSignal, signal, Layout } from "@revideo/2d";

export interface LogoProps extends NodeProps {
}

export class Logo extends Node {

    private mainContainer = createRef<Layout>()

    public constructor(props: LogoProps) {
        super({ ...props, });

        this.add(
            <Layout ref={this.mainContainer} opacity={0.9} layout>
                <Rect fill={"#ff0000"} padding={[15, 25]} layout>
                    <Txt fontFamily={"inter"} fontSize={48} fontWeight={800} fill={"#ffffff"}>NEWS</Txt>
                </Rect>
                <Rect fill={"#ffffff"} padding={[15, 25]} layout>
                    <Txt fontFamily={"inter"} fontSize={48} fontWeight={800} fill={"#ff0000"}>PRO</Txt>
                </Rect>
            </Layout>
        )
        this.position.y(this.mainContainer().height() - 1920/2 + 36)
        this.position.x(-this.mainContainer().width()/2 + 1080/2 - 48)
    }
}