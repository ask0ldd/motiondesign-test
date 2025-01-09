import { NodeProps, Rect, Txt, Node, initial, colorSignal, signal, Layout } from "@revideo/2d";
import { all, chain, ColorSignal, createRef, easeInOutCubic, easeInSine, range, Reference, Signal, SignalValue, SimpleSignal, Vector2 } from "@revideo/core";
import '../global.css';

export interface TxtBlockProps extends NodeProps {
    textLines : string[]
    decorator? : Side
}

export enum Side {
    Left = "Left",
    Right = "Right"
}
  
export class TxtBlock extends Node {
    @initial('#00000088')
    @colorSignal()
    public declare readonly backgroundColor: ColorSignal<this>;
  
    @initial('#ffffff')
    @colorSignal()
    public declare readonly textColor: ColorSignal<this>;
  
    @initial(30)
    @signal()
    public declare readonly padding: SimpleSignal<number>;
  
    private mainLayout = createRef<Layout>()
    private textContainer = createRef<Rect>()
    // private lineContainers = range(5).map(rec => createRef<Rect>())
    private decorator = createRef<Rect>()
    private textLinesRefs = range(5).map(line => createRef<Txt>())
    private lineContainersHeight : number
    private textContainersHeight : number
    private textContainersWidth : number
    private mainLayoutWidth : number
    private isDecorator = false
  
    public constructor(props: TxtBlockProps) {
        super({ ...props, });
    
        if(props.decorator) this.isDecorator = true

        this.add(
            <Layout ref={this.mainLayout} gap={12} layout>
                {props.decorator == "Left" && <Rect ref={this.decorator} opacity={0} fill={"#ffffff"} width={12}/>}
                <Rect opacity={1} fill={this.backgroundColor} padding={this.padding} ref={this.textContainer} direction={'column'} rowGap={10} layout>
                    {props.textLines.map((textLine, index) => 
                        <Rect layout>
                            <Txt ref={this.textLinesRefs[index]} lineHeight={'130%'} fontFamily={'Inter'} fontWeight={700} fontSize={40} fill={this.textColor}>{textLine}</Txt>
                        </Rect>)}
                </Rect>
                {props.decorator == "Right" && <Rect ref={this.decorator} opacity={0} fill={"#ffffff"} width={12}/>}
            </Layout>
        );
        this.mainLayoutWidth = this.mainLayout().width()
    }

    public *init(open : boolean = true){
        this.textContainersHeight = this.textContainer().height()
        this.textContainersWidth = this.textContainer().width()
        // this.lineContainersHeight = this.lineContainers[0]().height() + 4 // choose the linecontainer with the biggest height instead
        this.lineContainersHeight = (this.textContainer().children()[0] as Rect).height() + 4
        if(this.isDecorator) this.decorator().save()
        this.textContainer().save();
        // this.lineContainers.forEach(lc => {
        (this.textContainer().children() as Rect[]).forEach(rect => {
            rect.clip(true);
            rect.save()
        });
        // this.lineContainers.forEach(lc => lc().layout(false))
        (this.textContainer().children() as Rect[]).forEach(rect => rect.layout(false))
        this.textContainer().restore();
        // this.lineContainers.forEach(lc => lc().restore())
        (this.textContainer().children() as Rect[]).forEach(rect => rect.restore())
        this.textContainer().layout(false)
        this.mainLayout().layout(false)
        if(this.isDecorator) this.decorator().restore()
        if(!open) {
            // this.lineContainers.forEach(container => container().height(0))
            (this.textContainer().children() as Rect[]).forEach(rect => rect.height(0))
            this.textContainer().height(0)
            this.textContainer().width(0)
            this.textContainer().padding(0)
        }

    }

    public *foldLineContainers(){
        yield* all(
            chain(...(this.textContainer().children() as Rect[]).map(rect => rect.height(0, 0.2, easeInSine))),
            // chain(...(this.textContainer().children() as Rect[]).map(rect => rect.position.x(300, 0.2, easeInSine))),
            chain(...(this.textContainer().children() as Rect[]).map(rect => rect.opacity(0, 0.2, easeInSine))),
        )
    }

    public *unfoldLineContainers(){
        if(this.lineContainersHeight) yield* chain(...(this.textContainer().children() as Rect[]).map(rect => rect.height(this.lineContainersHeight, 0.35, easeInSine)))
        
    }

    public *show() {
        yield* this.textContainer().opacity(0, 0).to(1, 0.5, easeInSine);
    }
    
    public *hide() {
        yield* this.textContainer().opacity(1, 0).to(0, 1, easeInSine);
    }

    public *snapLeftBorder(marginLeft : number = 0, viewWidth : number){
        if(this.mainLayoutWidth) this.mainLayout().position.x(- viewWidth/2 + this.mainLayoutWidth/2 + marginLeft)
    }

    public *snapRightBorder(marginRight : number = 0, viewWidth : number){
        if(this.mainLayoutWidth) this.mainLayout().position.x(+ viewWidth/2 - this.mainLayoutWidth/2 - marginRight)
    }
  
    public *closeTextContainer(){
        yield* chain(
            all(
                this.textContainer().width(10, 0.35, easeInSine),
                this.textContainer().padding(0, 0.35, easeInSine),
                // this.isDecorator ? this.decorator().position.x(-1000, 0.15, easeInSine) : void 0
            ),
            this.textContainer().height(0, 0.25, easeInSine),
        )
    }

    public *decoratorDisappearLeft(){
        yield* this.decorator().position.x(-1000, 0.15, easeInSine)
        this.decorator().remove()
    }

    public *openTextContainer(){
        if(this.textContainersWidth && this.textContainersHeight)
        yield* all(
            chain(
            all(
                this.show(),
                this.textContainer().width(this.textContainersWidth, 0.75, easeInSine),
                this.textContainer().padding(10, 0.75, easeInSine),
            ),
            this.textContainer().height(this.textContainersHeight, 0.5, easeInSine),
            ),
            this.decorator().opacity(1, 1.25)
        )
    }
}

export default TxtBlock