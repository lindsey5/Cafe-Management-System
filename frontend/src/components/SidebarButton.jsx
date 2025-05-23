import { Button } from "@mui/material"

const SidebarButton = ({ sx, ...props}) => {
    return <Button 
            fullWidth 
            sx={[{
                color: '#3c3c3c', 
                fontWeight: 'bold', 
                textTransform: 'none', 
                justifyContent: 'flex-start',
                gap: 1,
                borderRadius: '10px',
                fontSize: '16px',
                paddingLeft: '10px',
                ":hover": {
                    color: '#FF8C00'
                },
                fontFamily: "Roboto, sans-serif",
                }, 
                sx]}
            {...props}
    />
}

export default SidebarButton