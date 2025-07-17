<?php
///<references from='System' />
///<references from='Reflect' />
class DataEntity
{
    private $data = null;
    private $members = [];
    public function load($data, \Closure $validate = null, \Closure $convert = null){
        if($data==null || !(is_object($data) || is_array($data))){
            throw new \Exception('Invalid data');
        }
        $isnull = $this->data === null;
        $this->data =  (array)$data;
        if($isnull){
            $descriptor = Reflect::getDescriptor($this);
            $exists = [];
            while($descriptor && $descriptor->isStruct()){
                $items = $descriptor->getMembers();
                foreach($items as $item){
                    if($item->isColumn() && $item->isPublic()){
                        $key = $item->getKey();
                        if(!isset($exists[$key])){
                            $exists[$key] = true;
                            array_push($this->members, $item);
                        }
                    }
                }
                $descriptor = Reflect::getDescriptor($descriptor->getInherit());
            }
        }
        foreach($this->members as $member){
            $key = $member->getKey();
            if(isset($this->data[$key])){
                $value = $this->data[$key];
                $formal = $this->getFormal($member) ?? ['varchar', 255];
                if($convert){
                    $value = call_user_func_array($convert, $formal);
                }else{
                    $value = $this->convert($value, ...$formal);
                }
                if($value===null || $value===false){
                    throw new \Exception("Assignment entity value cannot is null or false.");
                }
                if($validate){
                    if(call_user_func($validate, $value, ...$formal)){
                        $member->setPropertyValue($value);
                    }else{
                        throw new \Exception("Validate failed the '$key' value.");
                    }
                }else{
                    if($this->validate($value, ...$formal)){
                        $member->setPropertyValue($value);
                    }else{
                        throw new \Exception("Validate failed the '$key' value.");
                    }
                }
            }else if(!$member->isOptional()){
                throw new \Exception("Property the '$key' is required.");
            }
        }
    }

    protected function validate($value, $formal, ...$args){
        $type = gettype($value);
        if($type ==='object' || $type==='resource' || is_array($value)){
            return false;
        }
        switch(strtolower($formal)){
            case 'set' :
            case 'enum' :
                return in_array(strval($value), $args);
            case 'varchar' :
                $max = $args[0] ?? 255;
                return strlen($value) <= $max;
            case 'decimal' :
                if(!is_numeric($value))return false;
                $max = $args[0] ?? 11;
                $decimal = $args[1] ?? 4;
                @list($left, $right) = explode('.', strval($value));
                return strlen($left) <= $max && strlen($right??'') <= $decimal;
            case 'double' :
            case 'float' :
                return is_numeric($value);
            case 'tinyint' :
            case 'smallint' :
            case 'mediumint' :
            case 'int' :
            case 'bigint' :
            case 'time' :
                if(!is_numeric($value))return false;
                $max = $args[0] ?? 15;
                return strlen(strval($value)) <= $max;
            case 'email' :
                return filter_var($value, FILTER_VALIDATE_EMAIL) !== false;
            case 'range' :
                $min = $args[0] ?? 0;
                $max = $args[1] ?? 255;
                $len = strlen(strval($value));
                return $min <= $len && $max >= $len;
            case 'char' :
                $len = $args[0] ?? 0;
                return $len>0 ? strlen(strval($value))===$len : true;

        }
        return true;
    }

    protected function convert($value, $formal, ...$args){
        $type = gettype($value);
        if($type ==='object'){
            return json_encode($value, JSON_UNESCAPED_UNICODE);
        }else if(is_array($value)){
            $key = key($value);
            if($key === 0){
                return implode(',',$value);
            }
            return json_encode($value, JSON_UNESCAPED_UNICODE);
        }else if($type==="boolean"){
            return intval($value);
        }
        switch(strtolower($formal)){
            case 'tinyint' :
            case 'smallint' :
            case 'mediumint' :
            case 'int' :
            case 'bigint' :
            case 'numberic' :
            case 'time' :  
                return intval($value);
            case 'double' :
            case 'float' :
            case 'decimal' :
                return floatval($value);
            default :
                return strval($value);
        }
        
    }

    protected function getFormal($member){
        $comments = $member->parseComments();
        for($i=count($comments);$i>0;$i--){
            $comment = $comments[$i-1];
            if(stripos($comment, '@Formal') === 0){
                $comment = trim(substr($comment, 7));
                $len = strlen($comment);
                if($len > 2 && ord($comment[0])===40 && ord($comment[$len-1]) === 41){
                    $comment = substr($comment, 1, -1);
                    return array_map(function($value){
                        $value = trim($value);
                        $code = ord($value[0]);
                        if($code===34 || $code===39){
                            $value = substr($value, 1, -1);
                        }else if(is_numeric($value)){
                            $value = intval($value);
                        }
                        return $value;
                    }, explode(',', $comment));
                }
            }
        }
        return null;
    }

    public function toEntity(array $excludes=null){
        $dataset = [];
        foreach($this->members as $member){
            $key = $member->getKey();
            if($excludes && in_array($key, $excludes)){
                continue;
            }else{
                $dataset[$key] = $member->getPropertyValue();
            }
        }
        return $dataset;
    }
}