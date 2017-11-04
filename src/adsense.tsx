import {h, Component} from 'preact';

interface AdsenseProps {
    client: string;
    slot: string;
    style?: object;
    format?: string;
}

export default class Adsense extends Component<AdsenseProps, {key:number}> {
    public static defaultProps: Partial<AdsenseProps> = {
        style: {display: 'block', background:'white'}, 
        format: 'auto'
    };

    constructor(props?:AdsenseProps, context?:any) {
        super(props, context)
        this.state = {
            key: Math.random()
        };
    }

    componentDidMount() {
        if(window) {
            const typelessWindow = window as any;
            (typelessWindow.adsbygoogle = typelessWindow.adsbygoogle || []).push({});
        }
    };

    render(props:AdsenseProps) {
        return <ins className="adsbygoogle"
            style={props.style}
            data-ad-client={props.client}
            data-ad-slot={props.slot}
            data-ad-format={props.format}
            data-adsbygoogle-status={this.state.key.toString()}></ins>
    }
};