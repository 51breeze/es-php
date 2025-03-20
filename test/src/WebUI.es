
import web.components.Component;
import web.From;
class WebUI extends Component{

    constructor(props){
        super(props);
    }

    private name = '123';
    private show = false;

    @Override
    public onInitialized():void{
        
    }

    @Override
    render():VNode|Component{
        return <From>
            <div>the is from slot</div>
            <d:if condition={this.show}>
                <div>the is if condition</div>
            </d:if>
            <d:else>
                <div>the is else condition</div>
            </d:else>
            <d:for name={[0]} item="val" key="index">
                <div>the is for val:{val} --- key:{index}</div>
                <div>===</div>
            </d:for>
        </From>
    }

}