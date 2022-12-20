import React from 'react'
import {Segment,Menu} from 'semantic-ui-react'

function Startbar(props) {

    const handleItemClick = () => {
        console.log("Item Clicked")
    }

    return (
        <div>
            <Segment inverted>
                <Menu inverted pointing secondary>
                    <Menu.Item
                        name='Login'
                        active={props.type === 'login'}
                        onClick={handleItemClick}
                    />
                    <Menu.Item
                        name='Register'
                        active={props.type === 'register'}
                        onClick={handleItemClick}
                    />
                
                </Menu>
            </Segment>
        </div>
    )
}

export default Startbar
