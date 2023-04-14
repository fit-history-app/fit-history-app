import styled from 'styled-components'


export const Button = styled.button`
    border: 1px solid #616A94;
    border-radius: 35px;
    padding: 15px 30px;
    text-decoration: none;
    color: #616A94;
    background-color: #fff8ec;
    transition: 0.3s;
    font-size: 1em;
    cursor: pointer;
    outline: none;
    margin-top: 1em;
    user-select: none;

    @media screen and (min-width: 1180px) {
        &:hover {
            color: white;
            background-color: #616A94;
        }
    }
`;

export default Button
