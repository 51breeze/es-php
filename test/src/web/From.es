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
            <s:default />
        </div>
    }

}