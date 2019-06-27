import React from "react"
import {useStaticQuery, graphql} from "gatsby"
import {createCompObj} from "../../helpers";
import ModalTeam from "../modal/ModalTeam";

export default ({children, nodeId}) => {
  const data = useStaticQuery(
    graphql`
        query {
          comp: allNodeTeamMember {
            edges {
              node {
                body {
                  value
                }       
                field_team_member_post_text
                title
                relationships {
                  field_team_member_photo_img {
                    localFile {
                      childImageSharp {
                        fluid {
                          src
                        }
                      }
                    }
                  }
                }                          
              }
            }
          }                           
        }
      `
  );

  //const component vars
  let component = {};
  let props = {
    name: 'title',
    post: 'field_team_member_post_text',
    desc: 'body.value',
    img: 'relationships.field_team_member_photo_img',
  };

  component = createCompObj(component, data.comp.edges, nodeId, props);

  function handleClick (e) {
    e.preventDefault();
    console.log('По ссылке кликнули.');
  }

  const Body = ({ item}) => {

    return (
      <span onClick={handleClick} style={{color: `red`}}>
        {item.name}
      </span>
    )
  }

  const Wrap = ({children}) => {
    return (
      <div className='b-team'>
        {children}
      </div>
    )
  }

  return (
    <>
      {component.isdData && component.isAllArrayHasValidProp &&
      <Wrap>

        {component.dataArr.map(({isProp, id, props: item}, i) => (

          <React.Fragment key={i}>

            {isProp &&

            <>

              {/*component html start*/}
              <Body item={item}>

                {
                  () => {
                    return (
                      <span>
                        {console.log(isProp)}
                      </span>
                    )
                  }
                }

              </Body>

              <ModalTeam item={item}/>

              {/*component html end*/}

            </>

            }

          </React.Fragment>
        ))}

      </Wrap>
      }

      {children}
    </>
  )
}