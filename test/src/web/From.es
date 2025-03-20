package web;
import web.components.Component;
import web.Input;
class From extends Component{

    constructor(props){
        super(props);
    }

    @Override
    render():VNode|Component{
        return <div>
            <Input />
            <d:each name={[1]} item="item" >
                <div>{item}</div>
            </d:each>
            <s:default />
        </div>
    }

}