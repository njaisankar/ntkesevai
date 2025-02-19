import React from 'react';

import './DashboardComponent.css';
const DashboardComponent = (() => {
    
    return(
        <>
        {
            <section id="statistics-card">
                <div class="row">
                    <div class="col-xl-3 col-md-4 col-sm-6">
                        <a href="pairchikoodam.com">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h4 class="font-weight-bolder">குடும்ப அட்டை</h4>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div class="col-xl-3 col-md-4 col-sm-6">
                        <a href="https://yahoo.com">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h4 class="font-weight-bolder">ஆதார்</h4>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div class="col-xl-3 col-md-4 col-sm-6">
                        <a href="https://google.com">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h4 class="font-weight-bolder">பான்</h4>
                                </div>
                            </div>
                        </a>
                    </div>

                </div>
            </section>
        }
        </>
    );    
});

export default DashboardComponent