import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from 'reactstrap';

import SimpleBar from "simplebar-react";


const SearchOption = () => {


    return (
        <React.Fragment>
            <form className="app-search d-none d-md-block">
                <div className="position-relative">
                    <Input type="text" className="form-control" placeholder="Search..."
                        id="search-options"
                    
                    />
                    <span className="mdi mdi-magnify search-widget-icon"></span>
                    <span className="mdi mdi-close-circle search-widget-icon search-widget-icon-close d-none"
                        id="search-close-options"></span>
                </div>
                
            </form>
        </React.Fragment>
    );
};

export default SearchOption;