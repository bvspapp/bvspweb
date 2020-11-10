import React from 'react';
import { Switch, Route } from 'react-router-dom';

import AppLayoutUser from '../components/AppLayoutUser';

import Home from '../pages/UserScreens/HomeUser';

import UserProfile from '../pages/UserScreens/UserProfile';

import BvspProducts from '../pages/UserScreens/BvspProducts';
import BvspMachineSearch from '../pages/UserScreens/BvspMachine/BvspMachineSearch';
import BvspMachineDetails from '../pages/UserScreens/BvspMachine/BvspMachineDetails';
import SpecialSolutionSearch from '../pages/UserScreens/SpecialSolutions/SpecialSolutionSearch';
import SpecialSolutionDetails from '../pages/UserScreens/SpecialSolutions/SpecialSolutionDetails';
import BvspServicesSearch from '../pages/UserScreens/BvspServices/BvspServicesSearch';
import BvspServicesDetails from '../pages/UserScreens/BvspServices/BvspServicesDetails';
import BvspPartsStSearch from '../pages/UserScreens/BvspPartsSt/BvspPartsStSearch';
import BvspPartsStDetails from '../pages/UserScreens/BvspPartsSt/BvspPartsStDetails';

import DepartmentsSelect from '../pages/UserScreens/DepartmentsSelect';
import EquipamentsSelect from '../pages/UserScreens/EquipamentsSelect';

import OurPartnersList from '../pages/UserScreens/BvspPartners/OurPartnersList';
import MetaSolutions from '../pages/UserScreens/BvspPartners/MetaSolutions';
import TipsAndNews from '../pages/UserScreens/BvspPartners/TipsAndNews';
import ChecklistDetails from '../pages/UserScreens/ChecklistDetails';

import FoodmateAbout from '../pages/UserScreens/BvspPartners/Foodmate/FoodmateAbout';
import FoodmateOptions from '../pages/UserScreens/BvspPartners/Foodmate/FoodmateOptions';
import FoodmateOptionDetails from '../pages/UserScreens/BvspPartners/Foodmate/FoodmateOptionDetails';

import TsubakiAbout from '../pages/UserScreens/BvspPartners/Tsubaki/TsubakiAbout';
import NeptuneDetails from '../pages/UserScreens/BvspPartners/Tsubaki/NeptuneDetails';
import SuperInoxDetails from '../pages/UserScreens/BvspPartners/Tsubaki/SuperInoxDetails';
import LambdaDetails from '../pages/UserScreens/BvspPartners/Tsubaki/LambdaDetails';
import TitanDetails from '../pages/UserScreens/BvspPartners/Tsubaki/TitanDetails';

import BvspToolsList from '../pages/UserScreens/BvspTools/BvspToolsList';
import HardnessConverter from '../pages/UserScreens/BvspTools/HardnessConverter';
import ToleranceConverter from '../pages/UserScreens/BvspTools/ToleranceConverter';
import UnitConverter from '../pages/UserScreens/BvspTools/UnitConverter';
import ThreadedHoleCalculator from '../pages/UserScreens/BvspTools/ThreadedHoleCalculator';
import StainlessSteels from '../pages/UserScreens/Education/StainlessSteels';

import SteelMicrostructures from '../pages/UserScreens/Education/SteelMicrostructures';
import Polymers from '../pages/UserScreens/Education/Polymers';
import PolymerDetails from '../pages/UserScreens/Education/PolymerDetails';

import Institutional from '../pages/UserScreens/Institutional';
import Contact from '../pages/UserScreens/Contact';
import AttendanceOptions from '../pages/UserScreens/AttendanceOptions';

const UserRoutes: React.FC = () => (
  <AppLayoutUser>
    <Switch>
      <Route path="/" exact component={Home} />

      <Route path="/profile" exact component={UserProfile} />

      <Route path="/bvspproducts" exact component={BvspProducts} />
      <Route path="/bvspmachines" exact component={BvspMachineSearch} />
      <Route path="/bvspmachine/:id" exact component={BvspMachineDetails} />

      <Route path="/specialsolutions" exact component={SpecialSolutionSearch} />
      <Route
        path="/specialsolution/:id"
        exact
        component={SpecialSolutionDetails}
      />

      <Route path="/bvspservices" exact component={BvspServicesSearch} />
      <Route path="/bvspservice/:id" exact component={BvspServicesDetails} />

      <Route
        path="/partsbymachine/:machine_id"
        exact
        component={BvspPartsStSearch}
      />
      <Route path="/part/:id" exact component={BvspPartsStDetails} />

      <Route path="/departments/:to" exact component={DepartmentsSelect} />
      <Route
        path="/equipaments/:department_id/:to"
        exact
        component={EquipamentsSelect}
      />

      <Route path="/ourpartners" exact component={OurPartnersList} />
      <Route path="/metasolutions" exact component={MetaSolutions} />
      <Route path="/foodmate" exact component={FoodmateAbout} />
      <Route
        path="/foodmateoptions/:option"
        exact
        component={FoodmateOptions}
      />

      <Route
        path="/foodmatedetails/:option"
        exact
        component={FoodmateOptionDetails}
      />

      <Route path="/tipsnews" exact component={TipsAndNews} />

      <Route
        path="/checklistdetails/:machine_id"
        exact
        component={ChecklistDetails}
      />

      <Route path="/tsubaki" exact component={TsubakiAbout} />
      <Route path="/neptunedetails" exact component={NeptuneDetails} />
      <Route path="/superinoxdetails" exact component={SuperInoxDetails} />
      <Route path="/lambdadetails" exact component={LambdaDetails} />
      <Route path="/titandetails" exact component={TitanDetails} />

      <Route path="/bvsptoolslist" exact component={BvspToolsList} />
      <Route path="/hardnessconverter" exact component={HardnessConverter} />
      <Route path="/toleranceconverter" exact component={ToleranceConverter} />
      <Route path="/unitconverter" exact component={UnitConverter} />
      <Route
        path="/threadedholecalculator"
        exact
        component={ThreadedHoleCalculator}
      />

      <Route path="/stainlesssteels" exact component={StainlessSteels} />
      <Route
        path="/steelmicrostructures"
        exact
        component={SteelMicrostructures}
      />
      <Route path="/polymers" exact component={Polymers} />
      <Route path="/polymerdetails/:type" exact component={PolymerDetails} />

      <Route path="/institutional" exact component={Institutional} />

      <Route path="/attendance" exact component={AttendanceOptions} />

      <Route path="/contact" exact component={Contact} />
    </Switch>
  </AppLayoutUser>
);

export default UserRoutes;
