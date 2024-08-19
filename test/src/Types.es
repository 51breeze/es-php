package{

    public enum Types {
        ADDRESS
        NAME

        label(){
            
            switch(this.value){
                case Types.ADDRESS :
                    return '地址'
                case Types.NAME :
                    return '名称'
                
            }
            return this.name;
            
        }
    }

}