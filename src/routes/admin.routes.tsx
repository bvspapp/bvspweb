import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from '../components/AppLayoutAdmin';

import Home from '../pages/HomeAdmin';

import UserRegister from '../pages/User/UserRegister';
import UserList from '../pages/User/UserList';

import FamilyRegister from '../pages/Family/FamilyRegister';
import FamilyList from '../pages/Family/FamilyList';

import OtherMachineRegister from '../pages/Machine/OtherMachine/OtherMachineRegister';
import OtherMachineList from '../pages/Machine/OtherMachine/OtherMachineList';

import BvspMachineList from '../pages/Machine/BvspMachine/BvspMachineList';
import BvspMachineRegister from '../pages/Machine/BvspMachine/BvspMachineRegister';

import DepartmentList from '../pages/Department/DepartmentList';
import DepartmentRegister from '../pages/Department/DepartmentRegister';
import DepartmentOrder from '../pages/Department/DepartmentOrder';

import SpecialSolutionList from '../pages/SpecialSolution/SpecialSolutionList';
import SpecialSolutionRegister from '../pages/SpecialSolution/SpecialSolutionRegister';

import BvspServiceList from '../pages/BvspService/BvspServiceList';
import BvspServiceRegister from '../pages/BvspService/BvspServiceRegister';
import BvspServiceOrder from '../pages/BvspService/BvspServiceOrder';

import BvspPartList from '../pages/BvspPart/BvspPartList';
import BvspPartRegister from '../pages/BvspPart/BvspPartRegister';

import PartsByMachineList from '../pages/BvspPart/PartsByMachineList';

import ChecklistList from '../pages/Checklist/ChecklistList';
import ChecklistRegister from '../pages/Checklist/ChecklistRegister';

import ExportPdfPartsByMachine from '../pages/BvspPart/ExportPdfPartsByMachine';
import ExportPdfCheckList from '../pages/Checklist/ExportPdfCheckList';
import GeneratePortfolioPdf from '../pages/GeneratePortfolioPdf';

import AttendanceRequestsList from '../pages/AttendanceRequests/AttendanceRequestsList';
import AttendanceRequestClassification from '../pages/AttendanceRequests/AttendanceRequestClassification';
import AttendanceRequestRegister from '../pages/AttendanceRequests/AttendanceRequestRegister';
import AttendanceRequestsIndicators from '../pages/AttendanceRequests/AttendanceRequestsIndicators';

import BudgetRequestsList from '../pages/AttendanceRequests/BudgetRequest/BudgetRequestsList';
import BudgetRequestDetails from '../pages/AttendanceRequests/BudgetRequest/BudgetRequestDetails';

import QualityRequestsList from '../pages/AttendanceRequests/QualityRequest/QualityRequestsList';
import QualityRequestDetails from '../pages/AttendanceRequests/QualityRequest/QualityRequestDetails';

import NotificationsBudgetRequestList from '../pages/AttendanceRequests/NotificationsRequest/NotificationsBudgetRequestList';
import NotificationsQualityRequestList from '../pages/AttendanceRequests/NotificationsRequest/NotificationsQualityRequestList';

const AdminRoutes: React.FC = () => (
  <Layout>
    <Switch>

      <Route path="/" exact component={Home} />

      <Route path="/users" exact component={UserList} />
      <Route path="/user/:action" exact component={UserRegister} />
      <Route path="/user/:action/:id" exact component={UserRegister} />

      <Route path="/families" exact component={FamilyList} />
      <Route path="/family/:action" exact component={FamilyRegister} />
      <Route path="/family/:action/:id" exact component={FamilyRegister} />

      <Route path="/other-machines" exact component={OtherMachineList} />
      <Route
        path="/other-machines/:action"
        exact
        component={OtherMachineRegister}
      />
      <Route
        path="/other-machines/:action/:id"
        exact
        component={OtherMachineRegister}
      />

      <Route path="/departments" exact component={DepartmentList} />
      <Route path="/department/:action" exact component={DepartmentRegister} />
      <Route
        path="/department/:action/:id"
        exact
        component={DepartmentRegister}
      />
      <Route path="/department-order" exact component={DepartmentOrder} />

      <Route path="/special-solutions" exact component={SpecialSolutionList} />
      <Route
        path="/special-solution/:action"
        exact
        component={SpecialSolutionRegister}
      />
      <Route
        path="/special-solution/:action/:id"
        exact
        component={SpecialSolutionRegister}
      />

      <Route path="/bvsp-machines" exact component={BvspMachineList} />
      <Route
        path="/bvsp-machine/:action"
        exact
        component={BvspMachineRegister}
      />
      <Route
        path="/bvsp-machine/:action/:id"
        exact
        component={BvspMachineRegister}
      />

      <Route path="/bvsp-services" exact component={BvspServiceList} />
      <Route
        path="/bvsp-service/:action"
        exact
        component={BvspServiceRegister}
      />
      <Route
        path="/bvsp-service/:action/:id"
        exact
        component={BvspServiceRegister}
      />
      <Route path="/bvsp-services-order" exact component={BvspServiceOrder} />

      <Route path="/bvsp-parts" exact component={BvspPartList} />
      <Route path="/bvsp-part/:action" exact component={BvspPartRegister} />
      <Route path="/bvsp-part/:action/:id" exact component={BvspPartRegister} />

      <Route
        path="/bvsp-parts-machine/:action/:id"
        exact
        component={PartsByMachineList}
      />

      <Route path="/checklists" exact component={ChecklistList} />
      <Route path="/checklist/:action" exact component={ChecklistRegister} />
      <Route
        path="/checklist/:action/:id"
        exact
        component={ChecklistRegister}
      />

      <Route
        path="/export-pdf-parts-machine/:action/:id"
        exact
        component={ExportPdfPartsByMachine}
      />

      <Route path="/checklist-pdf/:id" exact component={ExportPdfCheckList} />
      <Route path="/portfoliopdf" exact component={GeneratePortfolioPdf} />

      <Route path="/attendance" exact component={AttendanceRequestsList} />

      <Route
        path="/attendance-register"
        exact
        component={AttendanceRequestRegister}
      />
      <Route
        path="/attendance-request/view/:id"
        exact
        component={AttendanceRequestClassification}
      />
      <Route
        path="/attendance-request-indicators"
        exact
        component={AttendanceRequestsIndicators}
      />

      <Route path="/budgets" exact component={BudgetRequestsList} />
      <Route path="/budget/edit/:id" exact component={BudgetRequestDetails} />

      <Route path="/quality" exact component={QualityRequestsList} />
      <Route path="/quality/edit/:id" exact component={QualityRequestDetails} />

      <Route
        path="/request-notifications-budget"
        exact
        component={NotificationsBudgetRequestList}
      />

      <Route
        path="/request-notifications-quality"
        exact
        component={NotificationsQualityRequestList}
      />

    </Switch>
  </Layout>
);

export default AdminRoutes;
